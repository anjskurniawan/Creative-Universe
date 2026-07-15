# Shared Frontend

Folder ini hanya memiliki primitive yang benar-benar lintas domain: komponen UI, hooks generik, layout primitive, utility murni, style, tipe generik, dan validation helper.

Shared tidak boleh mengetahui route bisnis, endpoint Sub-App, permission domain, model domain, atau mengimpor dari `core`, `features`, dan `app`.

Target internal saat file dipindahkan: `components`, `hooks`, `layouts`, `lib`, `styles`, `types`, dan `validation`.
