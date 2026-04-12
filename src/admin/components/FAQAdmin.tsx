import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Save, HelpCircle, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { translations } from "@/lib/translations";

interface FaqItem {
  q_fr: string;
  q_en: string;
  q_es: string;
  a_fr: string;
  a_en: string;
  a_es: string;
}

type Lang = "fr" | "en" | "es";

const LANG_LABELS: Record<Lang, string> = { fr: "Français", en: "English", es: "Español" };

/** Convert translations.ts format to our editable format */
function defaultFaqItems(): FaqItem[] {
  const fr = translations.fr.faq.items as { q: string; a: string }[];
  const en = translations.en.faq.items as { q: string; a: string }[];
  const es = translations.es.faq.items as { q: string; a: string }[];

  return fr.map((_, i) => ({
    q_fr: fr[i]?.q || "",
    q_en: en[i]?.q || "",
    q_es: es[i]?.q || "",
    a_fr: fr[i]?.a || "",
    a_en: en[i]?.a || "",
    a_es: es[i]?.a || "",
  }));
}

async function loadFaqItems(): Promise<{ items: FaqItem[]; fromDb: boolean }> {
  if (!supabase) return { items: defaultFaqItems(), fromDb: false };
  const { data } = await supabase
    .from("site_config")
    .select("*")
    .eq("key", "faq")
    .maybeSingle();
  if (data?.value && Array.isArray((data.value as Record<string, unknown>).items)) {
    return { items: (data.value as { items: FaqItem[] }).items, fromDb: true };
  }
  return { items: defaultFaqItems(), fromDb: false };
}

export function FAQAdmin() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<Lang>("fr");

  useEffect(() => {
    let cancelled = false;
    loadFaqItems().then((result) => {
      if (cancelled) return;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(result.items);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const handleSave = async () => {
    if (!supabase) {
      toast.error("Base de données indisponible");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("site_config").upsert({
      key: "faq",
      value: { items },
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) {
      toast.error("Erreur de sauvegarde : " + error.message);
    } else {
      toast.success("FAQ sauvegardées !");
    }
  };

  const addItem = () => {
    setItems([...items, { q_fr: "", q_en: "", q_es: "", a_fr: "", a_en: "", a_es: "" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof FaqItem, value: string) => {
    setItems(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setItems(newItems);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Chargement…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            FAQ
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Questions fréquentes affichées sur chaque page tour. Google les affiche en rich snippets.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addItem}>
            <Plus className="w-4 h-4 mr-2" /> Ajouter
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#c9a961] hover:bg-[#b8944e] text-white gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Enregistrer
          </Button>
        </div>
      </div>

      {/* Language tabs */}
      <Card>
        <CardContent className="p-2">
          <div className="flex gap-1">
            {(["fr", "en", "es"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setActiveLang(l)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                  activeLang === l
                    ? "bg-[#c9a961] text-white shadow"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {LANG_LABELS[l]}
                {/* Show completion badge */}
                <span className="ml-2 text-xs opacity-70">
                  {items.filter((item) => item[`q_${l}`] && item[`a_${l}`]).length}/{items.length}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ items */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-400 italic">
            Aucune FAQ. Cliquez "Ajouter" pour créer la première question.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-4 pb-2 flex flex-row items-center gap-2">
                <div className="flex flex-col gap-1 mr-1">
                  <button
                    onClick={() => moveItem(i, -1)}
                    disabled={i === 0}
                    className="text-gray-300 hover:text-gray-500 disabled:opacity-30"
                    title="Monter"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                </div>
                <Badge variant="outline" className="shrink-0">{i + 1}</Badge>
                <CardTitle className="text-sm flex-1 truncate text-gray-700">
                  {item[`q_${activeLang}`] || <span className="text-gray-300 italic">Question vide</span>}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(i)}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question ({LANG_LABELS[activeLang]})
                  </label>
                  <Input
                    value={item[`q_${activeLang}`]}
                    onChange={(e) => updateItem(i, `q_${activeLang}`, e.target.value)}
                    placeholder={`Question en ${LANG_LABELS[activeLang]}…`}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Réponse ({LANG_LABELS[activeLang]})
                  </label>
                  <Textarea
                    value={item[`a_${activeLang}`]}
                    onChange={(e) => updateItem(i, `a_${activeLang}`, e.target.value)}
                    placeholder={`Réponse en ${LANG_LABELS[activeLang]}…`}
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center">
        <Button variant="outline" onClick={addItem} className="gap-2">
          <Plus className="w-4 h-4" /> Ajouter une question
        </Button>
      </div>
    </div>
  );
}
