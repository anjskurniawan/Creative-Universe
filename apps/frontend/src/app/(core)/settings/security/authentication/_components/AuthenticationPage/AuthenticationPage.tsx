"use client";

import { Content, Heading, InlineAlert } from "@react-spectrum/s2/InlineAlert";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };

export default function AuthenticationPage() {
  return (
    <InlineAlert variant="informative" fillStyle="boldFill" styles={style({ width: "100%" })}>
          <Heading>Autentikasi Doran Login</Heading>
          <Content>
            Kata sandi dikelola oleh Doran Login dan tidak dapat diubah dari Creative Universe.
          </Content>
    </InlineAlert>
  );
}
