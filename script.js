// DOM加载完成后执行所有脚本
document.addEventListener('DOMContentLoaded', function() {
    // 响应式导航菜单
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // 平滑滚动功能
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 考虑导航栏高度
                    behavior: 'smooth'
                });
                
                // 关闭移动端菜单
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // 初始化AOS滚动动画
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
    
    // 视差滚动效果
    function handleParallax() {
        const scrollPosition = window.pageYOffset;
        
        // 获取所有带有parallax类的元素
        const parallaxElements = document.querySelectorAll('.parallax-image');
        
        parallaxElements.forEach((element) => {
            // 获取元素相对于视口的位置
            const elementRect = element.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // 检查元素是否在视口中
            if (elementRect.top < viewportHeight && elementRect.bottom > 0) {
                // 元素在视口中，计算视差效果
                const speed = parseFloat(element.getAttribute('data-parallax-speed') || '0.3');
                // 基于元素在视口中的位置计算视差位移
                // 当元素在视口中心时，位移为0
                const centerOfElement = elementRect.top + elementRect.height / 2;
                const centerOfViewport = viewportHeight / 2;
                const distanceFromCenter = centerOfElement - centerOfViewport;
                
                // 计算Y轴位移，反向运动
                const yPos = -distanceFromCenter * speed * 0.1;
                
                // 应用视差效果
                element.style.transform = `translateY(${yPos}px)`;
            } else {
                // 元素不在视口中，重置transform
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // 滚动时添加元素动画
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.scroll-animate');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate-in');
            }
        });
    }
    
    // 初始执行
    handleParallax();
    handleScrollAnimations();
    
    // 滚动事件监听
    window.addEventListener('scroll', () => {
        handleParallax();
        handleScrollAnimations();
    });
    
    // 窗口大小变化时重新计算
    window.addEventListener('resize', handleParallax);
    
    // 轮播功能实现
    function initCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentSlide = 0;
        let slideInterval;
        
        // 自动轮播间隔时间（毫秒）
        const autoSlideInterval = 5000;
        
        // 显示指定幻灯片
        function showSlide(index) {
            // 隐藏所有幻灯片
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            // 显示当前幻灯片
            slides[index].classList.add('active');
            indicators[index].classList.add('active');
            
            // 更新当前幻灯片索引
            currentSlide = index;
        }
        
        // 下一张幻灯片
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        // 上一张幻灯片
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
        
        // 开始自动轮播
        function startAutoSlide() {
            slideInterval = setInterval(nextSlide, autoSlideInterval);
        }
        
        // 停止自动轮播
        function stopAutoSlide() {
            clearInterval(slideInterval);
        }
        
        // 事件监听
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
        
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                stopAutoSlide();
                showSlide(index);
                startAutoSlide();
            });
        });
        
        // 鼠标悬停时停止自动轮播
        const carouselContainer = document.querySelector('.carousel-container');
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
        
        // 初始化显示第一张幻灯片并开始自动轮播
        showSlide(0);
        startAutoSlide();
    }
    
    // 初始化轮播
    initCarousel();
    
    // 三图轮播功能实现 - 圆环闭环循环
    function initCarousel3() {
        const carouselWrapper = document.querySelector('.carousel-3-wrapper');
        const slides = document.querySelectorAll('.carousel-3-slide');
        
        // 移除之前可能添加的所有克隆幻灯片
        const originalSlidesCount = slides.length;
        while (carouselWrapper.children.length > originalSlidesCount) {
            carouselWrapper.removeChild(carouselWrapper.lastChild);
        }
        
        // 只克隆第一个幻灯片到末尾，实现无缝闭环
        const firstSlideClone = slides[0].cloneNode(true);
        carouselWrapper.appendChild(firstSlideClone);
        
        let scrollPosition = 0;
        let isTransitioning = false;
        let scrollSpeed = 0.8; // 加快滚动速度
        let animationFrameId;
        
        // 持续滚动函数
        function continuousScroll() {
            if (isTransitioning) {
                animationFrameId = requestAnimationFrame(continuousScroll);
                return;
            }
            
            // 持续更新滚动位置
            scrollPosition += scrollSpeed;
            
            // 获取单个幻灯片的宽度
            const slideWidth = slides[0].offsetWidth;
            const totalOriginalWidth = originalSlidesCount * slideWidth;
            
            // 当滚动到克隆的第一个幻灯片时，无缝切换回原始开头
            if (scrollPosition >= totalOriginalWidth) {
                // 关闭过渡效果
                carouselWrapper.style.transition = 'none';
                // 重置到开头
                scrollPosition = scrollPosition - totalOriginalWidth;
                carouselWrapper.style.transform = `translateX(-${scrollPosition}px)`;
                // 在下一帧重新开启过渡效果
                requestAnimationFrame(() => {
                    carouselWrapper.style.transition = '';
                });
            } else {
                // 正常滚动
                carouselWrapper.style.transform = `translateX(-${scrollPosition}px)`;
            }
            
            // 继续下一帧滚动
            animationFrameId = requestAnimationFrame(continuousScroll);
        }
        
        // 开始持续滚动
        function startContinuousScroll() {
            stopContinuousScroll(); // 确保没有重复的动画帧
            animationFrameId = requestAnimationFrame(continuousScroll);
        }
        
        // 停止持续滚动
        function stopContinuousScroll() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }
        
        // 初始化轮播
        carouselWrapper.style.transform = 'translateX(0)';
        startContinuousScroll();
        
        // 窗口大小变化时重新计算
        window.addEventListener('resize', () => {
            scrollPosition = 0;
            // 移除克隆幻灯片，重新添加
            if (carouselWrapper.children.length > originalSlidesCount) {
                carouselWrapper.removeChild(carouselWrapper.lastChild);
            }
            const newClone = slides[0].cloneNode(true);
            carouselWrapper.appendChild(newClone);
        });
    }
    
    // 初始化三图轮播
    initCarousel3();

    // ECharts数据可视化
    function initECharts() {
        // 检查ECharts是否加载
        if (typeof echarts === 'undefined') {
            console.log('ECharts library not found');
            return;
        }
        
        const trails = ['Trail 1', 'Trail 2', 'Trail 3', 'Trail 4', 'Trail 5'];
        
        // 通用图表配置函数
        const getOption = (title, series, colors) => ({
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            title: {
                text: title,
                textStyle: { color: '#2C3E50', fontSize: 16 }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderWidth: 0,
                textStyle: { color: '#fff' },
                formatter: function(params) {
                    let result = params[0].name + '<br/>';
                    params.forEach(function(param) {
                        result += param.marker + param.seriesName + ': ' + param.value + ' N<br/>';
                    });
                    return result;
                }
            },
            legend: {
                top: '5%',
                textStyle: { color: '#5D6D7E' }
            },
            grid: { left: '8%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: {
                type: 'category',
                data: trails,
                axisLine: { lineStyle: { color: '#475569' } }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} N'
                },
                splitLine: { lineStyle: { color: '#334155' } },
                axisLine: { lineStyle: { color: '#475569' } }
            },
            series: series.map((s, i) => ({
                ...s,
                type: 'line',
                smooth: true,
                symbolSize: 8,
                lineStyle: { width: 3 },
                color: colors[i],
                areaStyle: {
                    opacity: 0.3
                }
            }))
        });

        // 1. 初始化差值图表
        const diffChart = echarts.init(document.getElementById('diffChart'));
        if (diffChart) {
            diffChart.setOption(getOption('ΔForce (Experimental - Control)', [
                { name: 'ΔF5 (Pressure Sensor 1)', data: [2.1, 3.6, 3.58, 2.15, 3.48] },
                { name: 'ΔF6 (Pressure Sensor 2)', data: [1.9, 2.14, 1.79, 1.66, 2.26] }
            ], ['#3b82f6', '#f59e0b']));
        }

        // 2. 初始化 F5 对比图表
        const f5Chart = echarts.init(document.getElementById('f5Chart'));
        if (f5Chart) {
            f5Chart.setOption(getOption('Force 5 Comparison (Pressure Sensor 1)', [
                { name: 'Control F5', data: [2.38, 2.65, 2.72, 1.85, 1.83] },
                { name: 'Experimental F5', data: [4.48, 6.25, 6.3, 4.0, 5.31] }
            ], ['#60a5fa', '#f87171']));
        }

        // 3. 初始化 F6 对比图表
        const f6Chart = echarts.init(document.getElementById('f6Chart'));
        if (f6Chart) {
            f6Chart.setOption(getOption('Force 6 Comparison (Pressure Sensor 2)', [
                { name: 'Control F6', data: [1.62, 1.69, 1.73, 1.3, 1.28] },
                { name: 'Experimental F6', data: [3.52, 3.83, 3.52, 2.96, 3.54] }
            ], ['#34d399', '#fbbf24']));
        }

        // 响应式处理
        window.addEventListener('resize', () => {
            diffChart && diffChart.resize();
            f5Chart && f5Chart.resize();
            f6Chart && f6Chart.resize();
        });
    }

    // 团队成员卡片悬停效果
    function initTeamCardEffects() {
        const teamCards = document.querySelectorAll('.team-card');
        
        teamCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const quote = card.querySelector('.member-quote');
                if (quote) {
                    quote.style.maxHeight = quote.scrollHeight + 'px';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const quote = card.querySelector('.member-quote');
                if (quote) {
                    quote.style.maxHeight = '0';
                }
            });
        });
    }

    // 折纸结构动画效果


    // 表单提交处理
    function initFormSubmission() {
        const contactForm = document.querySelector('.contact-form form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // 这里可以添加实际的表单提交逻辑
                const submitBtn = contactForm.querySelector('.btn-primary');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = '发送中...';
                submitBtn.disabled = true;
                
                // 模拟提交延迟
                setTimeout(() => {
                    submitBtn.textContent = '发送成功！';
                    submitBtn.style.backgroundColor = '#27AE60';
                    
                    // 重置表单
                    contactForm.reset();
                    
                    // 恢复按钮状态
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.backgroundColor = '';
                    }, 2000);
                }, 1500);
            });
        }
    }

    // 滚动进度条
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0;
            height: 4px;
            background-color: #3498DB;
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // 初始化所有功能
    function initAll() {
        // 检查ECharts是否加载并初始化
        initECharts();

        // 检查AOS是否加载
        if (typeof AOS !== 'undefined') {
            // AOS已在前面初始化
        } else {
            console.log('AOS library not found');
        }

        // 初始化其他功能
        initTeamCardEffects();
        initFormSubmission();
        initScrollProgress();
    }

    // 启动所有初始化函数
    initAll();
});

// 页面加载完成后添加额外的动画效果
window.addEventListener('load', function() {
    // 添加页面加载完成的类，用于触发某些动画
    document.body.classList.add('page-loaded');
    
    // 延迟显示某些元素，增强视觉效果
    setTimeout(() => {
        const delayedElements = document.querySelectorAll('.fade-in-delayed');
        delayedElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 500);
});