import { useEffect, useMemo, useState } from "react";
import { Search, Download, X, Save, Loader2, Mail, Phone, MapPin, FileText, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { Customer, CustomerNote, Reservation } from "@/lib/types";
import { downloadCsv, formatPriceFr } from "../utils/csv-export";

interface CustomersTabProps {
  reservations: Reservation[];
}

type SortKey = "lastBooking" | "totalSpent" | "reservationCount" | "name";

// Aggregate reservations + customer_notes overrides into a Customer[].
// One Customer per distinct lowercased email.
function aggregateCustomers(
  reservations: Reservation[],
  notesByEmail: Map<string, CustomerNote>,
): Customer[] {
  const groups = new Map<string, Reservation[]>();
  for (const r of reservations) {
    if (!r.email) continue;
    const key = r.email.trim().toLowerCase();
    if (!key) continue;
    const arr = groups.get(key) ?? [];
    arr.push(r);
    groups.set(key, arr);
  }

  const customers: Customer[] = [];
  for (const [email, resvs] of groups) {
    // Sort by date desc to get the "most recent" name/phone/address
    const sorted = [...resvs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const mostRecent = sorted[0];
    const note = notesByEmail.get(email);

    // Compose default address from billing fields of the most recent reservation
    const composedBilling = [
      mostRecent.billingAddress,
      mostRecent.billingCity,
      mostRecent.billingZip,
      mostRecent.billingCountry,
    ]
      .filter((v) => v && String(v).trim())
      .join(", ");

    // First / last booking date — by tour date (not createdAt)
    const dates = resvs.map((r) => r.date).filter(Boolean).sort();
    const firstBooking = dates[0] ?? "";
    const lastBooking = dates[dates.length - 1] ?? "";

    // Favorite tour: most-booked tour name
    const tourCounts = new Map<string, number>();
    for (const r of resvs) {
      tourCounts.set(r.tourName, (tourCounts.get(r.tourName) ?? 0) + 1);
    }
    let favoriteTour = "";
    let maxCount = 0;
    for (const [name, count] of tourCounts) {
      if (count > maxCount) {
        maxCount = count;
        favoriteTour = name;
      }
    }

    // Total spent — exclude cancelled reservations from the sum
    const totalSpent = resvs
      .filter((r) => r.status !== "cancelled")
      .reduce((sum, r) => sum + (r.totalPrice ?? 0), 0);

    customers.push({
      email,
      name: mostRecent.name ?? "",
      phone: note?.phone ?? mostRecent.phone ?? "",
      address: note?.address ?? composedBilling,
      notes: note?.notes ?? "",
      reservationCount: resvs.length,
      totalSpent,
      firstBooking,
      lastBooking,
      favoriteTour,
      reservations: sorted,
    });
  }

  return customers;
}

export function CustomersTab({ reservations }: CustomersTabProps) {
  const [notesByEmail, setNotesByEmail] = useState<Map<string, CustomerNote>>(
    new Map(),
  );
  // Loading is true only if supabase is available — we'll fetch in the effect.
  // If supabase is null we never fetch, so loading stays false from the start.
  const [loading, setLoading] = useState(() => supabase !== null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("lastBooking");
  const [selected, setSelected] = useState<Customer | null>(null);

  // Fetch customer_notes from Supabase
  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    supabase
      .from("customer_notes")
      .select("*")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("Failed to fetch customer_notes:", error);
        } else if (data) {
          const map = new Map<string, CustomerNote>();
          for (const row of data) {
            const r = row as Record<string, unknown>;
            map.set(String(r.email).toLowerCase(), {
              email: String(r.email),
              phone: (r.phone as string) ?? null,
              address: (r.address as string) ?? null,
              notes: (r.notes as string) ?? null,
              createdAt: r.created_at as string,
              updatedAt: r.updated_at as string,
            });
          }
          setNotesByEmail(map);
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const customers = useMemo(
    () => aggregateCustomers(reservations, notesByEmail),
    [reservations, notesByEmail],
  );

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = customers;
    if (q) {
      list = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.phone && c.phone.toLowerCase().includes(q)),
      );
    }
    const sorted = [...list].sort((a, b) => {
      switch (sortKey) {
        case "lastBooking":
          return (b.lastBooking || "").localeCompare(a.lastBooking || "");
        case "totalSpent":
          return b.totalSpent - a.totalSpent;
        case "reservationCount":
          return b.reservationCount - a.reservationCount;
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return 0;
      }
    });
    return sorted;
  }, [customers, search, sortKey]);

  const handleExportAll = () => {
    if (filteredSorted.length === 0) {
      toast.info("Aucun client à exporter");
      return;
    }
    const headers = [
      "Email",
      "Nom",
      "Téléphone",
      "Adresse",
      "Nb réservations",
      "Total dépensé (€)",
      "Première résa",
      "Dernière résa",
      "Tour préféré",
      "Notes",
    ];
    const rows = filteredSorted.map((c) => [
      c.email,
      c.name,
      c.phone,
      c.address,
      c.reservationCount,
      formatPriceFr(c.totalSpent),
      c.firstBooking,
      c.lastBooking,
      c.favoriteTour,
      c.notes,
    ]);
    const filename = `clients_${new Date().toISOString().split("T")[0]}.csv`;
    downloadCsv(filename, headers, rows);
    toast.success(`${filteredSorted.length} clients exportés`);
  };

  const handleExportSingle = (customer: Customer) => {
    // RGPD portability: export one customer + all their reservations
    const sectionHeaders = ["=== Client ==="];
    const customerHeaders = [
      "Email",
      "Nom",
      "Téléphone",
      "Adresse",
      "Notes",
      "Total dépensé (€)",
      "Première résa",
      "Dernière résa",
    ];
    const customerRow = [
      customer.email,
      customer.name,
      customer.phone,
      customer.address,
      customer.notes,
      formatPriceFr(customer.totalSpent),
      customer.firstBooking,
      customer.lastBooking,
    ];

    const reservationHeaders = [
      "ID",
      "Date",
      "Tour",
      "Participants",
      "Statut",
      "Prix (€)",
      "Pick-up",
      "Adresse pick-up",
      "Créée le",
    ];
    const reservationRows = customer.reservations.map((r) => [
      r.id,
      r.date,
      r.tourName,
      r.participants,
      r.status,
      formatPriceFr(r.totalPrice ?? 0),
      r.pickupTime ?? "",
      r.pickupAddress ?? "",
      r.createdAt,
    ]);

    // Two-section CSV: customer block + reservations block separated by an empty row
    const allHeaders = sectionHeaders;
    const allRows: (string | number | null | undefined)[][] = [
      customerHeaders,
      customerRow,
      [],
      ["=== Réservations ==="],
      reservationHeaders,
      ...reservationRows,
    ];
    const safeEmail = customer.email.replace(/[^a-z0-9]/gi, "_");
    const filename = `client_${safeEmail}_${new Date().toISOString().split("T")[0]}.csv`;
    downloadCsv(filename, allHeaders, allRows);
    toast.success("Données du client exportées");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Clients</h2>
          <p className="text-sm text-gray-500">
            {customers.length} client{customers.length > 1 ? "s" : ""} unique
            {customers.length > 1 ? "s" : ""}
            {filteredSorted.length !== customers.length &&
              ` · ${filteredSorted.length} après filtre`}
          </p>
        </div>
        <Button
          onClick={handleExportAll}
          className="bg-[#c9a961] hover:bg-[#b8944e] text-white gap-2"
        >
          <Download className="w-4 h-4" />
          Exporter CSV
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, email, téléphone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="px-3 py-2 border border-gray-200 rounded-md bg-white text-sm"
            >
              <option value="lastBooking">Tri : Dernière résa</option>
              <option value="totalSpent">Tri : Total dépensé</option>
              <option value="reservationCount">Tri : Nb tours</option>
              <option value="name">Tri : Nom</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Chargement…
            </div>
          ) : filteredSorted.length === 0 ? (
            <div className="p-8 text-center text-gray-400 italic">
              {customers.length === 0
                ? "Aucun client pour le moment."
                : "Aucun client ne correspond à la recherche."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Nom
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 hidden sm:table-cell">
                      Email
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">
                      Tours
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">
                      Total
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">
                      Dernière résa
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSorted.map((c) => (
                    <tr
                      key={c.email}
                      onClick={() => setSelected(c)}
                      className="border-b hover:bg-amber-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {c.name || "—"}
                        <div className="text-xs text-gray-400 sm:hidden">
                          {c.email}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">
                        {c.email}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline">{c.reservationCount}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-amber-600 whitespace-nowrap">
                        {formatPriceFr(c.totalSpent)}€
                      </td>
                      <td className="py-3 px-4 text-gray-500 hidden md:table-cell whitespace-nowrap">
                        {c.lastBooking || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {selected && (
        <CustomerDrawer
          key={selected.email}
          customer={selected}
          onClose={() => setSelected(null)}
          onSaved={(updatedNote) => {
            setNotesByEmail((prev) => {
              const next = new Map(prev);
              next.set(selected.email, updatedNote);
              return next;
            });
            setSelected((prev) =>
              prev
                ? {
                    ...prev,
                    phone: updatedNote.phone ?? prev.phone,
                    address: updatedNote.address ?? prev.address,
                    notes: updatedNote.notes ?? "",
                  }
                : prev,
            );
          }}
          onExport={() => handleExportSingle(selected)}
        />
      )}
    </div>
  );
}

// ─── Customer detail drawer ──────────────────────────────────────────────

interface CustomerDrawerProps {
  customer: Customer;
  onClose: () => void;
  onSaved: (note: CustomerNote) => void;
  onExport: () => void;
}

function CustomerDrawer({
  customer,
  onClose,
  onSaved,
  onExport,
}: CustomerDrawerProps) {
  // Form state initialized from props. Parent passes key={customer.email}
  // so the component remounts when a different customer is opened, which
  // re-initializes these from the new props (no setState-in-effect needed).
  const [phone, setPhone] = useState(customer.phone);
  const [address, setAddress] = useState(customer.address);
  const [notes, setNotes] = useState(customer.notes);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!supabase) {
      toast.error("Base de données indisponible");
      return;
    }
    setSaving(true);
    const payload = {
      email: customer.email,
      phone: phone.trim() || null,
      address: address.trim() || null,
      notes: notes.trim() || null,
    };
    const { error } = await supabase.from("customer_notes").upsert(payload);
    setSaving(false);
    if (error) {
      console.error("Save customer_notes error:", error);
      toast.error("Échec de l'enregistrement : " + error.message);
      return;
    }
    toast.success("Client enregistré");
    onSaved({
      email: customer.email,
      phone: payload.phone,
      address: payload.address,
      notes: payload.notes,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {customer.name || customer.email}
            </h3>
            <p className="text-xs text-gray-500">{customer.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="gap-2"
            >
              <Download className="w-4 h-4" /> Exporter
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <Calendar className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Tours</p>
                <p className="text-xl font-bold">{customer.reservationCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <TrendingUp className="w-4 h-4 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Total dépensé</p>
                <p className="text-xl font-bold text-amber-600">
                  {formatPriceFr(customer.totalSpent)}€
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <MapPin className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Tour préféré</p>
                <p
                  className="text-xs font-medium truncate"
                  title={customer.favoriteTour}
                >
                  {customer.favoriteTour || "—"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Editable fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="cust-email" className="text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Mail className="w-3 h-3" /> Email
              </Label>
              <Input
                id="cust-email"
                value={customer.email}
                disabled
                className="mt-1 bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="cust-phone" className="text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Phone className="w-3 h-3" /> Téléphone
              </Label>
              <Input
                id="cust-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+34 6 ..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="cust-address" className="text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Adresse
              </Label>
              <Textarea
                id="cust-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Adresse libre…"
                rows={2}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="cust-notes" className="text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <FileText className="w-3 h-3" /> Notes internes
              </Label>
              <Textarea
                id="cust-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Préférences, restrictions alimentaires, anecdotes…"
                rows={4}
                className="mt-1"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#c9a961] hover:bg-[#b8944e] text-white gap-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Enregistrer
            </Button>
          </div>

          {/* Reservations history */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3">
              Historique ({customer.reservations.length})
            </h4>
            <div className="space-y-2">
              {customer.reservations.map((r) => (
                <div
                  key={r.id}
                  className="border border-gray-100 rounded-lg p-3 bg-gray-50"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {r.tourName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {r.date} · {r.participants} pers.
                        {r.pickupTime ? ` · ${r.pickupTime}` : ""}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-amber-600 whitespace-nowrap">
                        {formatPriceFr(r.totalPrice ?? 0)}€
                      </p>
                      <Badge
                        variant="outline"
                        className={
                          r.status === "confirmed"
                            ? "bg-green-50 text-green-700"
                            : r.status === "pending"
                              ? "bg-yellow-50 text-yellow-700"
                              : r.status === "cancelled"
                                ? "bg-red-50 text-red-700"
                                : "bg-blue-50 text-blue-700"
                        }
                      >
                        {r.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
