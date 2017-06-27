;(function(window) {
    
    // 严格模式
    'use strict'
    let c, ctx, w, h, balls;
    let requestAnimationFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
    
    let defaults = {
        ball_speed_range:[0.5,1.3],
        line_width:0.08,
        ball_count:15,
        canvas_height:400,
    }

    // 每一帧逻辑
    var oneFrame = function() {
        // 清除画布
        ctx.height = h

        // 画背景
        drawBack()

        // 画球
        balls.forEach(function(ball, index, arr) {
            ball.move()
        })

        // 画线
        computeLines()

        // 进入下一帧动画
        requestAnimationFrame(oneFrame)
    }

    // 计算两点间距离
    var distance = function(p1, p2) {
        return Math.sqrt(Math.abs(Math.pow(p1.x - p2.x, 2) - Math.pow(p1.y - p2.y, 2)));
    }
    
    // 计算任意两个球之间的距离
    var computeLines = function() {
        var bs = balls;
        var lines = [];
        for (let i = 0, l1 = bs.length; i < l1; i++) {
            for (let j = 0, l2 = bs.length; j < l2; j++) {
                var dis = distance(bs[i], bs[j])
                if (dis < 200 && dis > 0) {
                    drawLine({
                        x: bs[i].x,
                        y: bs[i].y
                    }, {
                        x: bs[j].x,
                        y: bs[j].y
                    }, dis / 200)
                }
            }
        }
    }

    // 绘制背景
    var drawBack = function() {
        ctx.fillStyle = 'rgb(0,153,195)'
        ctx.beginPath()
        ctx.fillRect(0, 0, w, h);
    }

    // 绘制球
    var drawCircle = function(x = 50, y = 50, r) {
        ctx.beginPath()
        ctx.fillStyle = 'rgba(77,184,213,.6)'
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.fill()
    }

    // 绘制线
    var drawLine = function(from = { x: 100, y: 0 }, to = { x: 200, y: 200 }, opacity = 0.8) {
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255,255,255,' + opacity + ')'
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.lineCap = 'round'
        ctx.lineWidth = defaults.line_width
        ctx.stroke()
    }

    // merge
    var merge = function(a,b){
        for(let key in b){
            console.log(key)
            a[key] = b[key]
        }
        
    }

    // 球类
    class Ball {
        constructor() {
            this.r = Math.random() * 15 + 0.5;
            this.x = Math.random() * (w - 20) + 10;
            this.y = Math.random() * (h - 20) + 10;
            this.dir = {
                x_c: Math.random() * 2 - 1,
                y_c: Math.random() * 2 - 1
            }
            this.speed = Math.random() * (defaults.ball_speed_range[1]-defaults.ball_speed_range[0]) + defaults.ball_speed_range[0]
        }

        // 移动
        move() {
            this.x += this.dir.x_c * this.speed
            this.y += this.dir.y_c * this.speed
            this.collisionDetection()
        }

        // 绘制自身
        draw() {
            drawCircle(this.x, this.y, this.r)
        }

        // 碰撞检测
        collisionDetection() {
            // 碰到左、右边框，x取反
            if (this.x - this.r <= 0 || this.x + this.r >= w) {
                this.dir.x_c = -this.dir.x_c
            }
            // 碰到上、下边框，y取反
            if (this.y - this.r <= 0 || this.y + this.r >= h) {
                this.dir.y_c = -this.dir.y_c
            }
            this.draw()
        }
    }

    // 插件类
    class DotLine {
        constructor({ id = 'canvas', option = {} } = {}) {
            c = document.getElementById(id)
            ctx = c.getContext('2d')
            merge(defaults,option)
            w = c.width = c.parentElement.clientWidth || defaults.width
            h = c.height = defaults.canvas_height
        }
        init() {
            
            // 抗锯齿
            if (window.devicePixelRatio) {
                c.style.width = w + 'px'
                c.style.height = h + 'px'
                c.width = w * window.devicePixelRatio
                c.height = h * window.devicePixelRatio
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
            }
            
            // 生成随机球
            balls = []
            for (let i = 0, num = defaults.ball_count; i < num; i++) {
                balls.push(new Ball())
            }
            
            // 开启动画
            requestAnimationFrame(oneFrame)
        }
    }

    // 兼容CommonJS规范
    if (typeof module !== 'undefined' && module.exports) module.exports = DotLine;
    
    // 兼容AMD规范
    if (typeof define === 'function') define(function() { return DotLine; });
    
    // 兼容浏览器环境
    window.DotLine = DotLine
})(this)