import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ====== ПАРАМЕТРЫ ======
const COUNT = 120;                    // сколько товаров сгенерировать
const OUT_PATH = "../data/products.json"; // куда сохраняем

// ====== ХЕЛПЕРЫ ======
const CURRENCIES = ["USD", "EUR", "RUB"];
const SELLERS = [
  "Acme LLC", "Nova Trade", "BestMarket", "Orbit", "QuickBuy",
  "PrimeStore", "FoxSeller", "Nordix", "CityMall", "AlphaTrade",
  "ElectroHub", "PixelPlus", "GigaStore", "TechnoMarket", "MegaShop"
];

function rndInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function rndFloat(min, max, d = 2) { return parseFloat((Math.random() * (max - min) + min).toFixed(d)); }
function pick(arr) { return arr[rndInt(0, arr.length - 1)]; }

function pad2(n) { return n.toString().padStart(2, "0"); }
function toISODate(date) {
  // YYYY-MM-DD без времени — удобно для фронта
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

// Понедельник–Воскресенье текущей недели
function getThisWeekRange() {
  const now = new Date();
  const day = now.getDay() === 0 ? 7 : now.getDay(); // Mon=1..Sun=7
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day - 1));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

function randomDateThisWeekISO() {
  const { monday, sunday } = getThisWeekRange();
  const t = rndInt(monday.getTime(), sunday.getTime());
  return toISODate(new Date(t));
}

// Простая «лоромка» на русском
const WORDS = ("универсальная компактная беспроводная проводная профессиональная " +
  "игровая офисная механическая мембранная быстрая тихая лёгкая ультра надёжная " +
  "клавиатура мышь наушники монитор зарядка адаптер кейс смартфон планшет").split(" ");

function loremWords(n) {
  let s = [];
  for (let i = 0; i < n; i++) s.push(pick(WORDS));
  // Первая буква заглавная:
  const str = s.join(" ");
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function makeAttributes() {
  return [
    { name: "Подключение", value: pick(["USB-C", "USB-A", "Bluetooth 5.3", "2.4 ГГц + USB-C"]) },
    { name: "Тип клавиш", value: pick(["Мембранные", "Механические (Red)", "Низкий профиль"]) },
    { name: "Подсветка", value: pick(["Белая", "RGB", "Без подсветки"]) + ", " + pick(["3 уровня", "5 уровней", "настраиваемая"]) },
    { name: "Совместимость", value: pick(["Windows / macOS / Linux", "Windows / macOS", "Android / iOS"]) }
  ];
}

function makeOffers(basePrice, currency, productId) {
  const count = rndInt(10, 15);
  const offers = [];
  for (let i = 0; i < count; i++) {
    const price = rndFloat(basePrice * (0.85 + Math.random() * 0.4), 2);
    offers.push({
      seller: pick(SELLERS),
      rating: rndFloat(3.0, 5.0, 1),
      price,
      currency,
      deliveryDate: randomDateThisWeekISO(),
      offerId: `${productId}-o${i + 1}`
    });
  }
  return offers;
}

function makeProduct(i) {
  const id = `p-${i.toString().padStart(4, "0")}`;
  const name = `${loremWords(1)} ${loremWords(2)} ${i}`; // пример: "Игровая клавиатура быстрая тихая 17"
  const currency = pick(CURRENCIES);
  const basePrice = rndFloat(8, 300, 2);
  const stock = rndInt(0, 50);
  const rating = rndFloat(3.0, 5.0, 1);
  const deliveryDate = randomDateThisWeekISO();

  return {
    id,
    name,
    thumbnail: `https://picsum.photos/seed/${id}/400/300`,
    fullImage: `https://picsum.photos/seed/${id}-full/1200/800`,
    price: basePrice,
    currency,
    stock,
    rating,
    deliveryDate,
    attributes: makeAttributes(),
    offers: makeOffers(basePrice, currency, id)
  };
}

// ====== ГЕНЕРАЦИЯ ======
const items = Array.from({ length: COUNT }, (_, idx) => makeProduct(idx + 1));

// Создадим путь до файла (конвертируем URL -> обычный путь)
const targetUrl = new URL(OUT_PATH, import.meta.url);
const targetPath = fileURLToPath(targetUrl); // <-- вот эта строчка ключевая
const targetDir = dirname(targetPath);

if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });

writeFileSync(targetPath, JSON.stringify(items, null, 2), "utf-8");
console.log(`✔ Сгенерировано ${items.length} товаров → ${targetPath}`);