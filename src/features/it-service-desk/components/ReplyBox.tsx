import type { TicketComment } from '../data';

interface Props {
  comments: TicketComment[];
  showInternal?: boolean;
  currentUserRole?: string;
}

function isCurrentUser(author: string): boolean {
  return author === 'Dr. Arvind Mehta' || author === 'You';
}

export default function ReplyBox({ comments, showInternal = false }: Props) {
  const visible = showInternal ? comments : comments.filter(c => !c.isInternal);

  return (
    <div className="space-y-4">
      {visible.map(comment => {
        const isMe = isCurrentUser(comment.author);
        const isInternal = comment.isInternal;

        return (
          <div
            key={comment.id}
            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-xl p-3 ${
                isInternal
                  ? 'bg-purple-50 border border-purple-200'
                  : isMe
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-gray-700">
                  {comment.author}
                </span>
                <span className="text-xs text-gray-400">
                  {comment.authorRole}
                </span>
                {isInternal && (
                  <span className="text-xs font-bold text-purple-600 flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">
                      lock
                    </span>
                    Internal Note
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {comment.text}
              </p>
              <p className="text-xs text-gray-400 mt-1">{comment.timestamp}</p>
            </div>
          </div>
        );
      })}
      {visible.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">
          No messages yet.
        </p>
      )}
    </div>
  );
}
