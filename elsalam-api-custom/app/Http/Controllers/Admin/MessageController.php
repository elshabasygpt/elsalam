<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $query = Message::orderByDesc('created_at');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->boolean('unread')) {
            $query->where('is_read', false);
        }

        return response()->json($query->paginate(20));
    }

    public function markRead(Message $message)
    {
        $message->update(['is_read' => true]);
        return response()->json(['message' => 'Marked as read.']);
    }
}
