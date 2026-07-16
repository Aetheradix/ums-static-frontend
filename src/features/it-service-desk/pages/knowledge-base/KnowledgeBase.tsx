import { useMemo, useState } from 'react';
import { FormPage, FormCard } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { initialKBArticles, initialKBComments } from '../../data';
import { itsmUrls } from '../../urls';
import type { KBArticle } from '../../data';

export default function KnowledgeBase() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<KBArticle | null>(
    null
  );

  const categories = useMemo(
    () => ['all', ...new Set(initialKBArticles.map(a => a.category))],
    []
  );
  const filtered = useMemo(() => {
    return initialKBArticles.filter(a => {
      if (selectedCategory !== 'all' && a.category !== selectedCategory)
        return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [search, selectedCategory]);

  const articleComments = useMemo(() => {
    if (!selectedArticle) return [];
    return initialKBComments.filter(c => c.articleId === selectedArticle.id);
  }, [selectedArticle]);

  return (
    <FormPage
      title="Knowledge Base"
      description="Search for solutions, guides, and troubleshooting articles."
      breadcrumbs={[
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Knowledge Base' },
      ]}
    >
      {selectedArticle ? (
        <FormCard
          title={selectedArticle.title}
          headerAction={
            <Button
              label="Back to List"
              variant="outlined"
              icon="arrow_back"
              onClick={() => setSelectedArticle(null)}
            />
          }
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedArticle.tags.map(tag => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <span>Category: {selectedArticle.category}</span>
            <span>Views: {selectedArticle.views}</span>
            <span>Rating: {selectedArticle.rating}/5</span>
            <span>Updated: {selectedArticle.updatedDate}</span>
          </div>
          <div className="prose prose-sm max-w-none">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
              {selectedArticle.content}
            </pre>
          </div>
          {articleComments.length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="text-sm font-bold text-gray-700 mb-3">
                Comments ({articleComments.length})
              </p>
              <div className="space-y-3">
                {articleComments.map(c => (
                  <div key={c.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-gray-700">
                        {c.author}
                      </span>
                      <span className="text-xs text-gray-400">
                        {c.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </FormCard>
      ) : (
        <>
          <div className="flex flex-wrap gap-3 mb-6">
            <TextBox
              value={search}
              onChange={(v: string) => setSearch(v)}
              placeholder="Search articles..."
              className="w-64"
              icon="search"
            />
            <DropDownList
              value={selectedCategory}
              onChange={(v: any) => setSelectedCategory(v)}
              data={
                categories.map(c => ({
                  label: c === 'all' ? 'All Categories' : c,
                  value: c,
                })) as any
              }
              textField="label"
              optionValue="value"
              defaultOptionText="All Categories"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(article => (
              <div
                key={article.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer bg-white"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-gray-400">
                    {article.id}
                  </span>
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">
                    {article.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  {article.summary}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {article.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{article.views} views</span>
                  <span className="text-amber-500">{article.rating}/5</span>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              No articles found. Try a different search term.
            </p>
          )}
        </>
      )}
    </FormPage>
  );
}
