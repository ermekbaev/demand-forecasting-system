'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Иконки для социальных сетей и контактов
const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="white" strokeWidth="2"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="white" strokeWidth="2"/>
  </svg>
);

const TelegramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const VKIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 13.662c.584.575 1.201 1.115 1.688 1.785.205.283.407.566.514.895.152.467-.106.983-.553 1.013l-2.335-.004c-.936.079-1.683-.3-2.262-.877-.46-.459-.885-.946-1.334-1.412-.189-.197-.383-.379-.628-.507-.554-.289-1.036-.22-1.334.303-.306.537-.357 1.131-.368 1.717-.018.804-.279 1.013-1.087 1.053-1.709.085-3.331-.204-4.724-1.298C4.276 14.967 2.956 13.407 1.85 11.678.579 9.698-.242 7.477.068 4.864c.18-1.514.959-2.573 2.456-2.74 1.155-.129 2.317-.095 3.474.01.593.054.984.46 1.039 1.054.111 1.197.332 2.378.646 3.529.243.896.611 1.747 1.334 2.336.586.476 1.084.34 1.334-.349.174-.478.236-1.003.236-1.528.006-1.395.024-2.79-.133-4.178-.098-.865-.488-1.434-1.334-1.583-.415-.073-.353-.22-.152-.442.358-.395.695-.633 1.369-.633h2.549c1.006.125 1.229.407 1.369 1.418l.006 3.026c-.011.423.21 1.675 1.06 1.955.68.223 1.13-.33 1.537-.737.87-.866 1.489-1.888 2.063-2.956.254-.473.469-.973.781-1.397.394-.537.797-.676 1.418-.539l2.549.01c.076 0 .153.001.228.014.955.168 1.217.596.914 1.515-.434 1.314-1.133 2.454-1.892 3.532-.823 1.169-.823 1.169.096 2.303z"/>
  </svg>
);

const PhoneIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const EmailIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const MapPinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const ClockIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const CreditCardIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const ShieldCheckIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const TruckIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13"/>
    <polygon points="16,8 20,8 23,11 23,16 16,16"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const DiamondIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3h12l4 6-10 12L2 9z"/>
  </svg>
);

// Данные для футера
const footerSections = {
  catalog: {
    title: 'Каталог',
    links: [
      { name: 'Все товары', href: '/catalog' },
      { name: 'Новинки', href: '/catalog?filter=new' },
      { name: 'Распродажа', href: '/catalog?filter=sale' },
      { name: 'Премиум коллекция', href: '/catalog?filter=premium' },
      { name: 'Кроссовки', href: '/categories/sneakers' },
      { name: 'Одежда', href: '/categories/clothing' },
    ]
  },
  brands: {
    title: 'Бренды',
    links: [
      { name: 'Nike', href: '/brands/nike' },
      { name: 'Adidas', href: '/brands/adidas' },
      { name: 'New Balance', href: '/brands/new-balance' },
      { name: 'Converse', href: '/brands/converse' },
      { name: 'Vans', href: '/brands/vans' },
      { name: 'Все бренды', href: '/brands' },
    ]
  },
  info: {
    title: 'Информация',
    links: [
      { name: 'О компании', href: '/about' },
      { name: 'Доставка и оплата', href: '/delivery' },
      { name: 'Возврат и обмен', href: '/returns' },
      { name: 'Размерная сетка', href: '/size-guide' },
      { name: 'Гарантии', href: '/warranty' },
      { name: 'Отзывы', href: '/reviews' },
    ]
  },
  support: {
    title: 'Поддержка',
    links: [
      { name: 'Связаться с нами', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Статус заказа', href: '/order-status' },
      { name: 'Личный кабинет', href: '/profile' },
      { name: 'Программа лояльности', href: '/loyalty' },
      { name: 'Помощь', href: '/help' },
    ]
  }
};

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon },
  { name: 'Telegram', href: 'https://t.me', icon: TelegramIcon },
  { name: 'VKontakte', href: 'https://vk.com', icon: VKIcon },
];

const contactInfo = [
  {
    icon: PhoneIcon,
    title: 'Телефон',
    content: '+7 (999) 123-45-67',
    link: 'tel:+79991234567'
  },
  {
    icon: EmailIcon,
    title: 'Email',
    content: 'info@store-premium.ru',
    link: 'mailto:info@store-premium.ru'
  },
  {
    icon: MapPinIcon,
    title: 'Адрес',
    content: 'г. Москва, ул. Примерная, 123',
    link: 'https://maps.google.com'
  },
  {
    icon: ClockIcon,
    title: 'Режим работы',
    content: 'Пн-Вс: 9:00 - 21:00',
    link: null
  }
];

const advantages = [
  {
    icon: TruckIcon,
    title: 'Бесплатная доставка',
    description: 'От 5000₽ по России'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Гарантия качества',
    description: '100% оригинальные товары'
  },
  {
    icon: CreditCardIcon,
    title: 'Удобная оплата',
    description: 'Наличные, карта, рассрочка'
  }
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-background to-muted/50 border-t border-border mt-20">
      {/* Преимущества */}
      <div className="border-b border-border py-10">
        <div className="max-w-[1600px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {advantages.map((advantage, index) => (
              <div key={index} className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-[20px] flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <advantage.icon size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2 tracking-tight">
                    {advantage.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    {advantage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Основной контент футера */}
      <div className="max-w-[1600px] mx-auto px-5 py-15">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          
          {/* Информация о компании */}
          <div className="lg:col-span-2 max-w-md">
            {/* Логотип */}
            <Link 
              href="/" 
              className="flex items-center gap-3 mb-6 no-underline group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform duration-200 group-hover:scale-110">
                <DiamondIcon size={24} className="text-white" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-foreground leading-none tracking-tight">
                  STORE
                </div>
                <div className="text-xs font-semibold text-muted-foreground tracking-[2px] uppercase">
                  Premium
                </div>
              </div>
            </Link>

            <p className="text-base leading-relaxed text-muted-foreground mb-8 font-normal">
              Премиальный интернет-магазин одежды и обуви. 
              Мы предлагаем только оригинальные товары от ведущих мировых брендов 
              с гарантией качества и быстрой доставкой.
            </p>

            {/* Социальные сети */}
            <div>
              <h4 className="text-base font-bold text-foreground mb-4">
                Мы в социальных сетях
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-muted border border-border rounded-xl flex items-center justify-center text-foreground no-underline transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-emerald-600 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30"
                  >
                    <social.icon size={22} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Навигационные секции */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key}>
              <h4 className="text-lg font-bold text-foreground mb-5 tracking-tight">
                {section.title}
              </h4>
              <nav className="space-y-2">
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block py-2 text-[15px] font-medium text-muted-foreground no-underline transition-all duration-200 hover:text-primary hover:pl-2 rounded-md"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          ))}

          {/* Контактная информация */}
          <div>
            <h4 className="text-lg font-bold text-foreground mb-5 tracking-tight">
              Контакты
            </h4>
            <div className="space-y-4">
              {contactInfo.map((contact, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-muted border border-border rounded-lg flex items-center justify-center flex-shrink-0">
                    <contact.icon size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      {contact.title}
                    </div>
                    {contact.link ? (
                      <a
                        href={contact.link}
                        className="text-[15px] font-semibold text-foreground no-underline transition-colors duration-200 hover:text-primary"
                      >
                        {contact.content}
                      </a>
                    ) : (
                      <div className="text-[15px] font-semibold text-foreground">
                        {contact.content}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Подвал */}
        <div className="pt-10 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-5">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <p className="text-sm text-muted-foreground font-medium">
                © 2024 Store Premium. Все права защищены.
              </p>
              <div className="flex flex-wrap gap-5">
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground font-medium no-underline transition-colors duration-200 hover:text-primary"
                >
                  Политика конфиденциальности
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground font-medium no-underline transition-colors duration-200 hover:text-primary"
                >
                  Пользовательское соглашение
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium">
                Создано с
              </span>
              <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center animate-pulse">
                <DiamondIcon size={10} className="text-white" />
              </div>
              <span className="text-sm text-primary font-semibold">
                для вас
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}