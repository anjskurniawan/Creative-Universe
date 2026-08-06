<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // SRD v6.2 Seksi 11.2 — Fonnte WhatsApp API
    'fonnte' => [
        'token' => env('FONNTE_TOKEN'),
        'sender' => env('FONNTE_SENDER'),
    ],

    // Google Services Integration for Sub-Apps
    'google' => [
        'apps_script_pricetag_url' => env('GOOGLE_APPS_SCRIPT_PRICETAG_URL', ''),
    ],

    // Kie.ai OpenAI-compatible API configuration for Creative AI.
    'kie_ai' => [
        'key' => env('KIE_AI_API_KEY'),
        'base_url' => env('KIE_AI_BASE_URL', 'https://api.kie.ai/gemini-3-6-flash-openai/v1'),
        'model' => env('KIE_AI_CHAT_MODEL', 'grok-4-5'),
        'model_base_urls' => [
            'grok-4-5' => env('KIE_AI_GROK_BASE_URL', 'https://api.kie.ai/grok/v1'),
            'gemini-3-6-flash' => env('KIE_AI_GEMINI_BASE_URL', 'https://api.kie.ai/gemini-3-6-flash-openai/v1'),
        ],
        'parameters' => [
            'memory' => env('KIE_AI_MEMORY'),
            'structured_outputs' => env('KIE_AI_STRUCTURED_OUTPUTS'),
            'function_calling' => env('KIE_AI_FUNCTION_CALLING'),
            'web_access' => env('KIE_AI_WEB_ACCESS'),
            'reasoning_effort' => env('KIE_AI_REASONING_EFFORT'),
            'stream_response' => env('KIE_AI_STREAM_RESPONSE'),
        ],
    ],

    // Legacy provider configuration.
    'groq' => [
        'key' => env('GROQ_API_KEY'),
        'base_url' => env('GROQ_BASE_URL', 'https://api.groq.com/openai/v1'),
        'model' => env('GROQ_CHAT_MODEL', 'openai/gpt-oss-120b'),
    ],

];
