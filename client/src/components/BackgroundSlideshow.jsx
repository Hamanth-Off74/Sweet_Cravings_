import { useEffect } from 'react';

function BackgroundSlideshow() {
  useEffect(() => {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.bg-slide');
    
    const showSlide = (n) => {
      slides.forEach(slide => slide.classList.remove('active'));
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
    };

    const interval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const backgroundSlides = [
    [
      {
        img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop",
        name: "Chocolate Cake",
        desc: "Rich and moist chocolate cake with layers of chocolate ganache",
        price: "₹180.00",
        oldPrice: "₹220.00",
        discount: "18% OFF"
      },
      {
        img: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&h=600&fit=crop",
        name: "Red Velvet Cake",
        desc: "Classic red velvet cake with smooth cream cheese frosting",
        price: "₹150.00",
        oldPrice: "₹180.00",
        discount: "17% OFF"
      },
      {
        img: "https://images.unsplash.com/photo-1606890737921-8fc77c8ea8c5?w=600&h=600&fit=crop",
        name: "Black Forest Cake",
        desc: "Decadent chocolate cake with cherries and whipped cream",
        price: "₹190.00",
        oldPrice: "₹220.00",
        discount: "14% OFF"
      }
    ],
    [
      {
        img: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=600&h=600&fit=crop",
        name: "Cheesecake",
        desc: "Creamy and smooth New York style cheesecake",
        price: "₹160.00",
        oldPrice: "₹190.00",
        discount: "16% OFF"
      },
      {
        img: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=600&h=600&fit=crop",
        name: "Blueberry Pie",
        desc: "Fresh blueberry pie with flaky golden crust",
        price: "₹160.00",
        oldPrice: "₹190.00",
        discount: "16% OFF"
      },
      {
        img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=600&fit=crop",
        name: "Chocolate Chip Cookie",
        desc: "Classic chocolate chip cookies - soft, chewy, and delicious",
        price: "₹40.00",
        oldPrice: "₹50.00",
        discount: "20% OFF"
      }
    ],
    [
      {
        img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=600&fit=crop",
        name: "Fruit Tart",
        desc: "Fresh fruit tart with custard filling and buttery crust",
        price: "₹180.00",
        oldPrice: "₹210.00",
        discount: "14% OFF"
      },
      {
        img: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=600&h=600&fit=crop",
        name: "Fudgy Brownie",
        desc: "Ultra-rich chocolate brownies with fudgy center",
        price: "₹80.00",
        oldPrice: "₹100.00",
        discount: "20% OFF"
      },
      {
        img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=600&fit=crop",
        name: "Vanilla Ice Cream",
        desc: "Premium vanilla ice cream made with real vanilla beans",
        price: "₹120.00",
        oldPrice: "₹140.00",
        discount: "14% OFF"
      }
    ]
  ];

  return (
    <div className="bg-slideshow">
      {backgroundSlides.map((slide, slideIndex) => (
        <div key={slideIndex} className={`bg-slide ${slideIndex === 0 ? 'active' : ''}`}>
          <div className="bg-slide-item">
            {slide.map((item, itemIndex) => (
              <div key={itemIndex} className="bg-product-card" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                <img src={item.img} alt={item.name} style={{ filter: 'blur(0px)' }} />
                <div className="bg-item-info" style={{ background: 'transparent' }}>
                  <span className="bg-discount-badge">{item.discount}</span>
                  <h3>{item.name}</h3>
                  <p>{item.desc}</p>
                  <div className="bg-price">
                    {item.price} <span className="bg-old-price">{item.oldPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default BackgroundSlideshow;
