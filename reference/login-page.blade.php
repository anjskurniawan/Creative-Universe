<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login - Creative Universe</title>

    <!-- Google Sans Flex -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap"
        rel="stylesheet" />

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        google: ['Google Sans Flex', 'sans-serif'],
                    },
                },
            },
        };
    </script>
</head>

<body
    class="min-h-screen bg-[url('https://i.pinimg.com/1200x/2a/68/ff/2a68ffb5bc0ea3d310d7ad3708f6282e.jpg')] bg-cover bg-center bg-no-repeat font-google text-[#232925]">
    <div class="relative flex min-h-screen w-full items-center justify-center px-5 py-10">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/30"></div>

        <!-- Login Card -->
        <div class="relative z-10 w-full max-w-[430px] rounded-[28px] bg-white px-8 py-8 shadow-2xl md:px-9">
            <h1 class="mb-[14px] text-[40px] font-medium leading-[48px] tracking-[-0.03em] text-black">
                Sign in to<br />
                Creative Universe
            </h1>

            <!-- Alert -->

            {{-- <div class=" mb-3 flex w-full rounded-[8px] bg-[rgba(255,56,60,0.14)] px-2 py-[10px]" role="alert">
                <p class="m-0 text-[13px] font-normal leading-[18px] text-[#FF383C]">
                    Username dan Password yang anda masukan tidak sesuai dengan database
                    <span class="font-semibold">Pasti Sukses</span>.
                    Periksa kembali data anda
                </p>
            </div> --}}


            <form id="loginForm" class="flex flex-col gap-[13px]" action="#" method="POST">
                <!-- Username -->
                <div class="relative h-[60px] w-full">
                    <input id="username" name="username" type="text" autocomplete="username" placeholder=" "
                        class="peer h-full w-full rounded-[8px] border border-[#909692] bg-white px-4 pt-[18px] text-[16px] font-medium leading-[24px] text-[#232925] outline-none transition-colors duration-200 placeholder-transparent focus:border-[#0088FF]" />

                    <label for="username"
                        class="pointer-events-none absolute left-4 top-[11px] translate-y-0 text-[13px] font-medium leading-[14px] text-[#909692] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[16px] peer-placeholder-shown:leading-[24px] peer-focus:top-[11px] peer-focus:translate-y-0 peer-focus:text-[13px] peer-focus:leading-[14px]">
                        Username
                    </label>
                </div>

                <!-- Password -->
                <div class="relative h-[60px] w-full">
                    <input id="password" name="password" type="text" autocomplete="current-password" placeholder=" "
                        style="-webkit-text-security: disc;"
                        class="peer h-full w-full rounded-[8px] border border-[#909692] bg-white px-4 pr-12 pt-[18px] text-[16px] font-medium leading-[24px] text-[#232925] outline-none transition-colors duration-200 placeholder-transparent focus:border-[#0088FF]" />

                    <label for="password"
                        class="pointer-events-none absolute left-4 top-[11px] translate-y-0 text-[13px] font-medium leading-[14px] text-[#909692] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[16px] peer-placeholder-shown:leading-[24px] peer-focus:top-[11px] peer-focus:translate-y-0 peer-focus:text-[13px] peer-focus:leading-[14px]">
                        Password
                    </label>

                    <button id="togglePassword" type="button"
                        class="hidden absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 items-center justify-center text-[#232925] transition-opacity duration-200 hover:opacity-70"
                        aria-label="Tampilkan password">
                        <!-- Mata terbuka -->
                        <svg id="iconShowPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                            class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round">
                            <path
                                d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z" />
                            <circle cx="12" cy="12" r="2.75" />
                        </svg>

                        <!-- Mata dicoret -->
                        <svg id="iconHidePassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                            class="hidden h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path
                                d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z" />
                            <circle cx="12" cy="12" r="2.75" />
                            <path d="M4 4L20 20" />
                        </svg>
                    </button>
                </div>

                <!-- Submit -->
                <div class="pt-[18px]">
                    <button id="submitButton" type="submit" disabled
                        class="flex h-[44px] w-full cursor-not-allowed items-center justify-center rounded-full bg-[#C6C6C8] px-2 text-[16px] font-medium leading-[24px] text-white transition-colors duration-200">
                        <span id="buttonText">Masuk</span>

                        <svg id="loadingIcon" class="hidden h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2Z" />
                        </svg>
                    </button>
                </div>
            </form>

            <p class="mx-auto mt-7 max-w-[364px] text-center text-[13px] font-normal leading-[18px] text-[#909692]">
                Dengan melanjutkan, Anda menyetujui
                <a href="#"
                    class="underline underline-offset-2 transition-colors duration-200 hover:text-[#232925]">
                    Syarat Layanan
                </a>,
                <a href="#"
                    class="underline underline-offset-2 transition-colors duration-200 hover:text-[#232925]">
                    Kebijakan Privasi
                </a>
                dan
                <a href="#"
                    class="underline underline-offset-2 transition-colors duration-200 hover:text-[#232925]">
                    Penggunaan Cookie
                </a>
                kami.
            </p>
        </div>

        <!-- Logo + Footer Text -->
        <div class="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center">
            <div class="mb-6 flex items-center justify-center gap-4">
                <img src="https://doran.id/wp-content/uploads/2023/03/Logo-PT-Doran-Sukses-Indonesia-white-1400x364-1.png"
                    alt="Doran Sukses Indonesia Logo" class="h-10 w-auto brightness-0 invert opacity-80" />

                <img src="https://jete.id/wp-content/uploads/2023/04/jete-indonesia-logo.png" alt="JETE Logo"
                    class="h-10 w-auto brightness-0 invert opacity-80" />
            </div>

            <p class="text-center text-xs text-white">
                Creative Universe | 2026
            </p>
        </div>
    </div>

    <script>
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const submitButton = document.getElementById('submitButton');
        const loginForm = document.getElementById('loginForm');

        const togglePassword = document.getElementById('togglePassword');
        const iconShowPassword = document.getElementById('iconShowPassword');
        const iconHidePassword = document.getElementById('iconHidePassword');

        const buttonText = document.getElementById('buttonText');
        const loadingIcon = document.getElementById('loadingIcon');

        function showFlex(element) {
            element.classList.remove('hidden');
            element.classList.add('flex');
        }

        function hideFlex(element) {
            element.classList.add('hidden');
            element.classList.remove('flex');
        }

        function showBlock(element) {
            element.classList.remove('hidden');
        }

        function hideBlock(element) {
            element.classList.add('hidden');
        }

        function updateFormState() {
            const hasUsername = usernameInput.value.trim() !== '';
            const hasPassword = passwordInput.value.trim() !== '';
            const canSubmit = hasUsername && hasPassword;

            submitButton.disabled = !canSubmit;

            if (canSubmit) {
                submitButton.classList.remove('bg-[#C6C6C8]', 'cursor-not-allowed');
                submitButton.classList.add('bg-[#0088FF]', 'cursor-pointer', 'hover:bg-[#0077E6]', 'active:bg-[#006BD1]');
            } else {
                submitButton.classList.add('bg-[#C6C6C8]', 'cursor-not-allowed');
                submitButton.classList.remove('bg-[#0088FF]', 'cursor-pointer', 'hover:bg-[#0077E6]',
                    'active:bg-[#006BD1]');
            }

            if (hasPassword) {
                showFlex(togglePassword);
            } else {
                hideFlex(togglePassword);

                passwordInput.style.webkitTextSecurity = 'disc';

                showBlock(iconShowPassword);
                hideBlock(iconHidePassword);

                togglePassword.setAttribute('aria-label', 'Tampilkan password');
            }
        }

        function togglePasswordVisibility() {
            const isPasswordHidden = passwordInput.style.webkitTextSecurity === 'disc';

            if (isPasswordHidden) {
                passwordInput.style.webkitTextSecurity = 'none';
                hideBlock(iconShowPassword);
                showBlock(iconHidePassword);
                togglePassword.setAttribute('aria-label', 'Sembunyikan password');
            } else {
                passwordInput.style.webkitTextSecurity = 'disc';
                showBlock(iconShowPassword);
                hideBlock(iconHidePassword);
                togglePassword.setAttribute('aria-label', 'Tampilkan password');
            }
        }

        function handleSubmit(event) {
            event.preventDefault();

            if (submitButton.disabled) return;

            submitButton.disabled = true;
            submitButton.classList.remove('bg-[#0088FF]', 'cursor-pointer', 'hover:bg-[#0077E6]', 'active:bg-[#006BD1]');
            submitButton.classList.add('bg-[#0088FF]', 'cursor-not-allowed');

            hideBlock(buttonText);
            showBlock(loadingIcon);

            setTimeout(() => {
                showBlock(buttonText);
                hideBlock(loadingIcon);
                updateFormState();
            }, 1200);
        }

        usernameInput.addEventListener('input', updateFormState);
        passwordInput.addEventListener('input', updateFormState);
        togglePassword.addEventListener('click', togglePasswordVisibility);
        loginForm.addEventListener('submit', handleSubmit);

        updateFormState();
    </script>
</body>

</html>
