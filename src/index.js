/*
 * LightningChartJS example showcasing the TimeTickStrategy feature which is ideal for displaying timestamp data between couple days all the way down to microseconds level.
 */
// Import LightningChartJS
const lcjs = require('@lightningchart/lcjs')

const xydata = require('@lightningchart/xydata')

// Extract required parts from LightningChartJS.
const { lightningChart, AxisTickStrategies, emptyFill, Themes, SolidLine, SolidFill, ColorRGBA } = lcjs

// Import data-generators from 'xydata'-library.
const { createProgressiveTraceGenerator } = xydata

const chart = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
    .ChartXY({
        legend: { visible: false },
        theme: (() => {
    const t = Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined
    const smallView = window.devicePixelRatio >= 2
    if (!window.__lcjsDebugOverlay) {
        window.__lcjsDebugOverlay = document.createElement('div')
        window.__lcjsDebugOverlay.style.cssText = 'position:fixed;top:0;left:0;background:rgba(0,0,0,0.7);color:#fff;padding:4px 8px;z-index:99999;font:12px monospace;pointer-events:none'
        if (document.body) document.body.appendChild(window.__lcjsDebugOverlay)
        setInterval(() => {
            if (!window.__lcjsDebugOverlay.parentNode && document.body) document.body.appendChild(window.__lcjsDebugOverlay)
            window.__lcjsDebugOverlay.textContent = window.innerWidth + 'x' + window.innerHeight + ' dpr=' + window.devicePixelRatio + ' small=' + (window.devicePixelRatio >= 2)
        }, 500)
    }
    return t && smallView ? lcjs.scaleTheme(t, 0.5) : t
})(),
textRenderer: window.devicePixelRatio >= 2 ? lcjs.htmlTextRenderer : undefined,
    })
    .setTitle('TimeTickStrategy example')

const axisX = chart
    .getDefaultAxisX()
    // Enable TimeTickStrategy for X Axis.
    .setTickStrategy(AxisTickStrategies.Time)

const axisY = chart.getDefaultAxisY()

const series = chart.addLineSeries()

// Generate ~8 hours of data for line series.
const numberOfPoints = 100 * 1000
// TimeTickStrategy interprets values as milliseconds (UNIX timestamp).
const xInterval = 8 * 60 * 60 * 1000
createProgressiveTraceGenerator()
    .setNumberOfPoints(numberOfPoints)
    .generate()
    .toPromise()
    .then((data) => {
        data = data.map((p) => ({
            x: (p.x * xInterval) / numberOfPoints,
            y: p.y,
        }))
        series.appendJSON(data)
    })
