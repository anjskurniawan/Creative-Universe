<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UI Test</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap"
        rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="font-sans">
@component('dev.components.navbar', ['logoUrl' => '#'])
    @component('dev.components.icon-link', ['href' => '', 'label' => 'Documents'])
        <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px"
            fill="currentColor" class="text-cu-ink">
            <path
                d="M239-360h67q28.91 0 49.46-20.25Q376-400.5 376-429v-103q0-29-19.5-48.5T308-600h-69v240Zm46-44v-151h25q11 0 18.5 7t7.5 18v101q0 11-7.5 18t-18.5 7h-25Zm149.95 44H525v-43h-77v-56h47v-43h-47v-55h77v-43h-91.87q-12.19 0-20.16 9-7.97 9-7.97 21v181q0 12 9 20.5t20.95 8.5Zm227.92-8.5Q672.09-377 675-390l56-210h-47.47L641-435l-42.53-165H551l56 209.94q3 13.06 12.22 21.56 9.21 8.5 21.82 8.5 12.62 0 21.83-8.5ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm0-72h528v-528H216v528Zm0-528v528-528Z" />
        </svg>
    @endcomponent

    @component('dev.components.icon-link', ['href' => '', 'label' => 'Notifications'])
        <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px"
            fill="currentColor" class="text-cu-ink">
            <path
                d="M160-200v-66.67h80v-296q0-83.66 49.67-149.5Q339.33-778 420-796v-24q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v24q80.67 18 130.33 83.83Q720-646.33 720-562.67v296h80V-200H160Zm320-301.33ZM480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM306.67-266.67h346.66v-296q0-72-50.66-122.66Q552-736 480-736t-122.67 50.67q-50.66 50.66-50.66 122.66v296Z" />
        </svg>
    @endcomponent

    @component('dev.components.icon-link', ['href' => '', 'label' => 'Apps'])
        <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px"
            fill="currentColor" class="text-cu-ink">
            <path
                d="M180.5-180.5Q160-201 160-230.67q0-29.66 20.5-50.16 20.5-20.5 50.17-20.5 29.66 0 50.16 20.5 20.5 20.5 20.5 50.16 0 29.67-20.5 50.17T230.67-160q-29.67 0-50.17-20.5Zm249.33 0q-20.5-20.5-20.5-50.17 0-29.66 20.5-50.16 20.5-20.5 50.17-20.5t50.17 20.5q20.5 20.5 20.5 50.16 0 29.67-20.5 50.17T480-160q-29.67 0-50.17-20.5Zm249.34 0q-20.5-20.5-20.5-50.17 0-29.66 20.5-50.16 20.5-20.5 50.16-20.5 29.67 0 50.17 20.5t20.5 50.16q0 29.67-20.5 50.17T729.33-160q-29.66 0-50.16-20.5ZM180.5-429.83Q160-450.33 160-480t20.5-50.17q20.5-20.5 50.17-20.5 29.66 0 50.16 20.5 20.5 20.5 20.5 50.17t-20.5 50.17q-20.5 20.5-50.16 20.5-29.67 0-50.17-20.5Zm249.33 0q-20.5-20.5-20.5-50.17t20.5-50.17q20.5-20.5 50.17-20.5t50.17 20.5q20.5 20.5 20.5 50.17t-20.5 50.17q-20.5 20.5-50.17 20.5t-50.17-20.5Zm249.34 0q-20.5-20.5-20.5-50.17t20.5-50.17q20.5-20.5 50.16-20.5 29.67 0 50.17 20.5T800-480q0 29.67-20.5 50.17t-50.17 20.5q-29.66 0-50.16-20.5ZM180.5-679.17q-20.5-20.5-20.5-50.16 0-29.67 20.5-50.17t50.17-20.5q29.66 0 50.16 20.5 20.5 20.5 20.5 50.17 0 29.66-20.5 50.16-20.5 20.5-50.16 20.5-29.67 0-50.17-20.5Zm249.33 0q-20.5-20.5-20.5-50.16 0-29.67 20.5-50.17T480-800q29.67 0 50.17 20.5t20.5 50.17q0 29.66-20.5 50.16-20.5 20.5-50.17 20.5t-50.17-20.5Zm249.34 0q-20.5-20.5-20.5-50.16 0-29.67 20.5-50.17t50.16-20.5q29.67 0 50.17 20.5t20.5 50.17q0 29.66-20.5 50.16-20.5 20.5-50.17 20.5-29.66 0-50.16-20.5Z" />
        </svg>
    @endcomponent

    @include('dev.components.avatar', ['href' => '#', 'initials' => 'AK'])

    @component('dev.components.action-button', ['href' => '#'])
        Action Button
    @endcomponent
@endcomponent

</body>

</html>
