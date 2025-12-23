
export const N8N_INGEST_WEBHOOK_URL = 'https://n8n.kibercar.com/webhook/ingest';
export const N8N_CHAT_WEBHOOK_URL = 'https://n8n.kibercar.com/webhook/chat';

export const APP_NAME = 'KIBERCAR AI';

const DEFAULT_CAR_BRANDS = [
  'Audi', 'Avatar', 'BMW', 'CRV 2018', 'Cadillac', 'Chevrolet Tahoe 2016', 
  'Evolute I-Pro', 'Exeed', 'Ford', 'Geely', 'Genesis G90', 'Huyndai', 
  'Infiniti', 'Jaguar', 'Jeep', 'KIA', 'Lend Rover', 'Lexus', 'Li', 
  'Lincoln Navigator 2020', 'MASERATI', 'MB', 'Mazda', 'Nissan', 
  'Skoda', 'Tank', 'Tesla', 'Toyota', 'VW', 'Volvo', 'Voyah'
].sort();

const DEFAULT_EQUIPMENT_CATEGORIES = [
  'Технические бюллетени', 'Массажер', 'Ароматизатор', 'Roik Qlink', 
  'Активный выхлоп', 'Амбиентная подсветка', 'Видео интерфейсы', 
  'Видео интерфейсы с навигациями', 'Видеорегистратор', 'Головные устройства', 
  'ДОВОДЧИКИ', 'Инвертор 222в', 'Инструкции разные', 'Камеры', 
  'Контроллеры', 'Миррорлинк', 'Мониторы на Андроиде', 'Мониторы-переделка-866', 
  'Навигации', 'Омыватели камер Parklogix', 'ПОРОГИ', 'Память сидения', 
  'Подогревы сидений AONE', 'Пошаговые инструкции', 'Роутеры', 
  'Система GoodWin', 'Система контроля слепых зон', 'Система кругового обзора 360', 
  'Система ночного видения', 'ТВ', 'Хрусталь', 'Электропривод крышки багажника', 
  'Тесты оборудования'
].sort();

export const getBrands = (): string[] => {
  const stored = localStorage.getItem('KIBERCAR_BRANDS');
  return stored ? JSON.parse(stored) : DEFAULT_CAR_BRANDS;
};

export const getCategories = (): string[] => {
  const stored = localStorage.getItem('KIBERCAR_CATEGORIES');
  return stored ? JSON.parse(stored) : DEFAULT_EQUIPMENT_CATEGORIES;
};
