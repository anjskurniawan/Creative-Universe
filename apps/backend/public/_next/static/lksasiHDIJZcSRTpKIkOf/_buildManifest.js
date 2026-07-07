self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/api/v1/:path*"
      },
      {
        "source": "/sanctum/csrf-cookie"
      },
      {
        "source": "/broadcasting/auth"
      },
      {
        "source": "/broadcasting/auth/"
      }
    ],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()