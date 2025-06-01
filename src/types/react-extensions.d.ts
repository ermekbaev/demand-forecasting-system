import { CSSProperties } from 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Разрешаем любые CSS-in-JS стили
    style?: CSSProperties & Record<string, any>;
  }
  
  interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes<T> {
    style?: CSSProperties & Record<string, any>;
  }
}
