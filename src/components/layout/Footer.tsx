'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

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
  { name: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { name: 'Telegram', href: 'https://t.me', icon: 'send' },
  { name: 'VKontakte', href: 'https://vk.com', icon: 'user' },
];

const contactInfo = [
  {
    icon: 'phone',
    title: 'Телефон',
    content: '+7 (999) 123-45-67',
    link: 'tel:+79991234567'
  },
  {
    icon: 'mail',
    title: 'Email',
    content: 'info@store-premium.ru',
    link: 'mailto:info@store-premium.ru'
  },
  {
    icon: 'map-pin',
    title: 'Адрес',
    content: 'г. Москва, ул. Примерная, 123',
    link: 'https://maps.google.com'
  },
  {
    icon: 'clock',
    title: 'Режим работы',
    content: 'Пн-Вс: 9:00 - 21:00',
    link: null
  }
];

const advantages = [
  {
    icon: 'truck',
    title: 'Бесплатная доставка',
    description: 'От 5000₽ по России'
  },
  {
    icon: 'shield',
    title: 'Гарантия качества',
    description: '100% оригинальные товары'
  },
  {
    icon: 'credit-card',
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
                  <Icon name={advantage.icon as any} size={28} className="text-white" />
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
                <Icon name="gem" size={24} className="text-white" />
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
                    <Icon name={social.icon as any} size={22} />
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
                    <Icon name={contact.icon as any} size={18} className="text-primary" />
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
                <Icon name="gem" size={10} className="text-white" />
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