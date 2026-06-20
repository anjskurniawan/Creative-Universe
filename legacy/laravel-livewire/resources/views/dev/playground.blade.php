<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UI Playground</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="min-h-screen bg-cu-surface-soft font-sans text-cu-ink antialiased">
    @include('dev.playground.partials.header')

    <main class="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-8">
        @include('dev.playground.partials.shell')
        @include('dev.playground.partials.alerts')
        @include('dev.playground.partials.metrics')
        @include('dev.playground.partials.data')
        @include('dev.playground.partials.forms')
    </main>
</body>

</html>
