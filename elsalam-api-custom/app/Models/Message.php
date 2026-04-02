<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    protected $fillable = [
        'name', 'email', 'phone', 'company', 'subject',
        'message', 'type', 'product_id', 'is_read',
    ];

    protected $casts = ['is_read' => 'boolean'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
