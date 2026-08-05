"use client";

import { useEffect, useState } from "react";
import { ClipboardList, CheckCircle2, Loader2 } from "lucide-react";

type Option = { id: number; option_text: string; vote_count: string };
type SurveyItem = {
  id: number;
  title: string;
  description: string | null;
  is_active: boolean;
  options: Option[];
  myVote: number | null;
};

export default function SurveyPage() {
  const [surveys, setSurveys] = useState<SurveyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [voting, setVoting] = useState<number | null>(null);
  const [error, setError] = useState<Record<number, string>>({});

  function loadSurveys() {
    fetch("/api/surveys")
      .then((res) => res.json())
      .then((data) => setSurveys(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadSurveys();
  }, []);

  async function submitVote(surveyId: number) {
    const optionId = selected[surveyId];
    if (!optionId) return;
    setVoting(surveyId);
    setError((prev) => ({ ...prev, [surveyId]: "" }));

    const res = await fetch(`/api/surveys/${surveyId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError((prev) => ({ ...prev, [surveyId]: data.error || "Failed to submit vote" }));
    } else {
      loadSurveys();
    }
    setVoting(null);
  }

  if (loading) {
    return <div className="flex justify-center py-16 text-muted"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Surveys & Polls</h2>
      <p className="text-muted">Participate in clinical surveys to help PAD shape future guidelines.</p>

      {surveys.length === 0 ? (
        <div className="card text-center text-muted py-10">No surveys available right now.</div>
      ) : (
        <div className="space-y-4 mt-6">
          {surveys.map((survey) => {
            const totalVotes = survey.options.reduce((sum, o) => sum + Number(o.vote_count), 0);
            const hasVoted = survey.myVote !== null;

            return (
              <div key={survey.id} className={`card border-l-4 ${survey.is_active ? "border-l-[var(--primary-color)]" : "border-l-gray-300 opacity-80"}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{survey.title}</h3>
                    {survey.description && <p className="text-sm text-gray-500 mt-1">{survey.description}</p>}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded font-bold flex items-center gap-1 flex-shrink-0 ${
                      survey.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {survey.is_active ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-green-500" /> Active
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={12} /> Closed
                      </>
                    )}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {survey.options.map((opt) => {
                    const pct = totalVotes ? Math.round((Number(opt.vote_count) / totalVotes) * 100) : 0;
                    if (hasVoted || !survey.is_active) {
                      return (
                        <div key={opt.id} className="relative">
                          <div className="flex justify-between text-sm mb-1">
                            <span className={`font-medium ${survey.myVote === opt.id ? "text-crimson" : ""}`}>{opt.option_text}</span>
                            <span className="text-muted">{pct}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--primary-color)] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    }
                    return (
                      <label key={opt.id} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name={`survey-${survey.id}`}
                          checked={selected[survey.id] === opt.id}
                          onChange={() => setSelected((prev) => ({ ...prev, [survey.id]: opt.id }))}
                        />
                        {opt.option_text}
                      </label>
                    );
                  })}
                </div>

                {error[survey.id] && <p className="text-xs text-red-600 mb-2">{error[survey.id]}</p>}

                {!hasVoted && survey.is_active && (
                  <button
                    onClick={() => submitVote(survey.id)}
                    disabled={voting === survey.id || !selected[survey.id]}
                    className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ClipboardList size={18} /> {voting === survey.id ? "Submitting..." : "Submit Vote"}
                  </button>
                )}
                {hasVoted && <p className="text-xs text-crimson font-medium">You voted &middot; {totalVotes} total votes</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
