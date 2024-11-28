import { useState } from 'react';

const GrammarChecker = () => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCheckGrammar = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setSuggestions([]);

    try {
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: text,
          language: 'en-US',
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSuggestions(data.matches || []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to check grammar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Grammar Checker</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write something here..."
        rows={10}
        className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleCheckGrammar}
        disabled={loading || !text.trim()}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Checking...' : 'Check Grammar'}
      </button>
      
      {suggestions.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Suggestions</h2>
          <ul className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="p-3 bg-gray-50 rounded">
                <p className="text-red-500 font-medium">Error: {suggestion.message}</p>
                {suggestion.replacements?.length > 0 && (
                  <p className="text-green-600 mt-1">
                    Suggestion: {suggestion.replacements.map(r => r.value).join(', ')}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GrammarChecker;