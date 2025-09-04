const products = {
  blender: {
    id: "blender",
    name: "Britânia Turbo Blender Model BLQ970P – 900 Watts, 2.6L, 110V",
    oldPrice: 220.63,
    price: 163.27,
    installments: "12 interest-free payments of $ 13.61",
    images: [
      "images/blender-img1.jpg",
      "images/blender-img2.jpg",
      "images/blender-img3.jpg",
    ],
    description: [
      { key: "Power", value: "900 Watts" },
      { key: "Capacity", value: "2.6 Liters" },
      { key: "Voltage", value: "110V" },
      { key: "Speeds", value: "4 + Pulse" },
    ],
    stock: 10,
  },
  "coffee-maker": {
    id: "coffee-maker",
    name: "Nespresso Essenza Mini Coffee Maker",
    oldPrice: 150.0,
    price: 129.99,
    installments: "10 interest-free payments of $ 13.00",
    images: [
      "images/nespresso-img1.jpg",
      "images/nespresso-img2.jpg",
      "images/nespresso-img3.jpg",
    ],
    description: [
      { key: "Brand", value: "Nespresso" },
      { key: "Model", value: "Essenza Mini" },
      { key: "Pressure", value: "19 bar" },
      { key: "Water Tank", value: "0.6 Liters" },
    ],
    stock: 15,
  },
  airfryer: {
    id: "airfryer",
    name: "Philips Essential Airfryer XL - 6.2L",
    oldPrice: 199.99,
    price: 179.99,
    installments: "12 interest-free payments of $ 15.00",
    images: [
      "images/airfryer-img1.jpg",
      "images/airfryer-img2.jpg",
      "images/airfryer-img3.jpg",
    ],
    description: [
      { key: "Brand", value: "Philips" },
      { key: "Capacity", value: "6.2 Liters" },
      { key: "Technology", value: "Rapid Air" },
      { key: "Features", value: "Dishwasher safe parts" },
    ],
    stock: 8,
  },
  "smart-tv": {
    id: "smart-tv",
    name: "Samsung 55-Inch 4K UHD Smart TV",
    oldPrice: 549.0,
    price: 479.0,
    installments: "12 interest-free payments of $ 39.92",
    images: [
      "images/smart-img1.jpg",
      "images/smart-img2.jpg",
      "images/smart-img3.jpg",
    ],
    description: [
      { key: "Screen Size", value: '55"' },
      { key: "Resolution", value: "4K UHD" },
      { key: "Smart TV", value: "Yes, Tizen OS" },
      { key: "HDR", value: "Yes" },
    ],
    stock: 5,
  },
  iphone: {
    id: "iphone",
    name: "Apple iPhone 15 - 128GB - Blue",
    oldPrice: 899.0,
    price: 799.0,
    installments: "12 interest-free payments of $ 66.58",
    images: [
      "images/iphone-img1.jpg",
      "images/iphone-img2.jpg",
      "images/iphone-img3.jpg",
    ],
    description: [
      { key: "Brand", value: "Apple" },
      { key: "Model", value: "iPhone 15" },
      { key: "Storage", value: "128GB" },
      { key: "Display", value: "6.1-inch Super Retina XDR" },
    ],
    stock: 20,
  },
};

module.exports = products;
