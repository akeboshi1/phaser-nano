const easeCache = {
    linear: (t) => {
        return t;
    },
    inQuad: (t) => {
        return t * t;
    },
    outQuad: (t) => {
        return t * (2 - t);
    },
    inOutQuad: (t) => {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    inCubic: (t) => {
        return t * t * t;
    },
    outCubic: (t) => {
        return (--t) * t * t + 1;
    },
    inOutCubic: (t) => {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    inQuart: (t) => {
        return t * t * t * t;
    },
    outQuart: (t) => {
        return 1 - (--t) * t * t * t;
    },
    inOutQuart: (t) => {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    },
    inQuint: (t) => {
        return t * t * t * t * t;
    },
    outQuint: (t) => {
        return 1 + (--t) * t * t * t * t;
    },
    inOutQuint: (t) => {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    },
    inSine: (t) => {
        return -1 * Math.cos(t / 1 * (Math.PI * 0.5)) + 1;
    },
    outSine: (t) => {
        return Math.sin(t / 1 * (Math.PI * 0.5));
    },
    inOutSine: (t) => {
        return -1 / 2 * (Math.cos(Math.PI * t) - 1);
    },
    inExpo: (t) => {
        return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1));
    },
    outExpo: (t) => {
        return (t == 1) ? 1 : (-Math.pow(2, -10 * t) + 1);
    },
    inOutExpo: (t) => {
        if (t == 0)
            return 0;
        if (t == 1)
            return 1;
        if ((t /= 1 / 2) < 1)
            return 1 / 2 * Math.pow(2, 10 * (t - 1));
        return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
    },
    inCirc: (t) => {
        return -1 * (Math.sqrt(1 - t * t) - 1);
    },
    outCirc: (t) => {
        return Math.sqrt(1 - (t = t - 1) * t);
    },
    inOutCirc: (t) => {
        if ((t /= 1 / 2) < 1)
            return -1 / 2 * (Math.sqrt(1 - t * t) - 1);
        return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    },
    inElastic: (t) => {
        if (t == 0)
            return 0;
        if (t == 1)
            return 1;
        let s = 1.70158;
        let p = 0;
        let a = 1;
        if (!p)
            p = 0.3;
        if (a < 1) {
            a = 1;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(1 / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
    },
    outElastic: (t) => {
        if (t == 0)
            return 0;
        if (t == 1)
            return 1;
        let s = 1.70158;
        let p = 0;
        let a = 1;
        if (!p)
            p = 0.3;
        if (a < 1) {
            a = 1;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(1 / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
    },
    inOutElastic: (t) => {
        if (t == 0)
            return 0;
        if ((t /= 1 / 2) == 2)
            return 1;
        let s = 1.70158;
        let p = 0;
        let a = 1;
        if (!p)
            p = (0.3 * 1.5);
        if (a < 1) {
            a = 1;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(1 / a);
        }
        if (t < 1)
            return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1;
    },
    inBack: (t, s = 1.70158) => {
        return 1 * t * t * ((s + 1) * t - s);
    },
    outBack: (t, s = 1.70158) => {
        return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);
    },
    inOutBack: (t, s = 1.70158) => {
        if ((t /= 1 / 2) < 1)
            return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
        return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
    },
    inBounce: (t) => {
        return 1 - easeCache.outBounce(1 - t);
    },
    outBounce: (t) => {
        if ((t /= 1) < (1 / 2.75)) {
            return (7.5625 * t * t);
        }
        else if (t < (2 / 2.75)) {
            return (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
        }
        else if (t < (2.5 / 2.75)) {
            return (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
        }
        else {
            return (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
        }
    },
    inOutBounce: (t) => {
        if (t < 1 / 2)
            return easeCache.inBounce(t * 2) * 0.5;
        return easeCache.outBounce(t * 2 - 1) * 0.5 + 0.5;
    }
};
export default function Ease(progress, easing) {
    if (easeCache[easing]) {
        return easeCache[easing](progress);
    }
}
//# sourceMappingURL=Ease.js.map