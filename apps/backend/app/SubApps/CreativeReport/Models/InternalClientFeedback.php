<?php

namespace App\SubApps\CreativeReport\Models;

use Illuminate\Database\Eloquent\Model;

class InternalClientFeedback extends Model
{
    protected $table = 'internal_client_feedback';

    protected $fillable = ['name', 'division', 'problems', 'suggestions', 'satisfaction'];
}
