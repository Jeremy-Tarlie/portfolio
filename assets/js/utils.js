function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
    
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

window.PERF_TIER = 'high';

const _perfTierCallbacks = [];

function onPerfTierReady(callback) {
    _perfTierCallbacks.push(callback);
}

function detectPerformanceTier() {
    const lowCoreCount = (navigator.hardwareConcurrency || 4) <= 2;
    
    let frameCount = 0;
    const start = performance.now();
    
    function sample() {
        frameCount++;
        if (frameCount < 10) {
            requestAnimationFrame(sample);
            return;
        }
        const elapsed = performance.now() - start;
        const avgFrameMs = elapsed / frameCount;
        
        let tier;
        if (avgFrameMs > 20 || lowCoreCount) {
            tier = 'low';
        } else if (avgFrameMs > 14) {
            tier = 'medium';
        } else {
            tier = 'high';
        }
        
        window.PERF_TIER = tier;
        if (tier === 'low' || tier === 'medium') {
            document.body.classList.add(tier === 'low' ? 'low-perf' : 'medium-perf');
        }
        
        _perfTierCallbacks.forEach(cb => cb(tier));
    }
    
    requestAnimationFrame(sample);
}

detectPerformanceTier();