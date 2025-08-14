"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ToastProvider";

interface Comment {
  id: string;
  text: string;
  replies: Comment[];
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { addToast } = useToast();

  const addNewComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = { id: uuidv4(), text: newComment, replies: [] };
    setComments([...comments, comment]);
    setNewComment("");
    addToast("Comment added!", "success");
  };

  const addReply = (parentId: string, replyText: string) => {
    if (!replyText.trim()) return;

    const updateReplies = (commentsList: Comment[]): Comment[] => {
      return commentsList.map((comment) => {
        if (comment.id === parentId) {
          const newReply: Comment = { id: uuidv4(), text: replyText, replies: [] };
          return { ...comment, replies: [...comment.replies, newReply] };
        } else {
          return { ...comment, replies: updateReplies(comment.replies) };
        }
      });
    };

    setComments(updateReplies(comments));
    addToast("Reply added!", "success");
  };

  const CommentItem = ({ comment }: { comment: Comment }) => {
    const [replyText, setReplyText] = useState("");
    const [showReply, setShowReply] = useState(false);

    return (
      <div className="ml-4 mt-2 border-l pl-4">
        <p>{comment.text}</p>
        <button
          onClick={() => setShowReply(!showReply)}
          className="text-blue-600 text-sm mt-1"
        >
          {showReply ? "Cancel" : "Reply"}
        </button>

        {showReply && (
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="border p-1 rounded flex-1"
              placeholder="Write a reply..."
            />
            <button
              onClick={() => {
                addReply(comment.id, replyText);
                setReplyText("");
                setShowReply(false);
              }}
              className="bg-green-500 text-white px-2 rounded"
            >
              Reply
            </button>
          </div>
        )}

        {comment.replies.length > 0 &&
          comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
      </div>
    );
  };

  return (
    <div className="p-4 border rounded max-w-xl">
      <h2 className="text-lg font-bold mb-2">Comments</h2>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="border p-2 rounded flex-1"
          placeholder="Add a comment..."
        />
        <button
          onClick={addNewComment}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <div className="mt-4">
        {comments.length === 0 && <p>No comments yet.</p>}
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
