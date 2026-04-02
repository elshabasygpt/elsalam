<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMessageRequest;
use App\Models\Message;

class MessageController extends Controller
{
    /**
     * POST /api/messages
     */
    public function store(StoreMessageRequest $request)
    {
        Message::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'تم إرسال رسالتك بنجاح. سيتم التواصل معك قريباً.',
        ], 201);
    }
}
