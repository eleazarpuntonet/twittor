importScripts('js/sw/sw-utils.js')

const CACHE_SHELL = 'SHELL-v1.1';
const CACHE_CONSTANT = 'CONSTANT-v1.1';
const CACHE_DYNAMIC = 'DYNAMIC-v1.1';

const APP_SHELL = [
    '/',
    '/index.html',
    '/css/style.css',
    '/img/favicon.ico',
    '/img/avatars/hulk.jpg',
    '/img/avatars/spiderman.jpg',
    '/img/avatars/thor.jpg',
    '/img/avatars/wolverine.jpg',
    '/img/avatars/ironman.jpg',
    '/js/app.js'
]

const APP_CONSTANT = [
    '/js/libs/jquery.js',
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    '/css/animate.css'
]

self.addEventListener('install', event =>{
    console.log('SW: Instalando servide worker')
    const SHELL = caches.open(CACHE_SHELL).then((cache)=>{
        return cache.addAll(APP_SHELL)
    })

    const CONSTANT = caches.open(CACHE_CONSTANT).then((cache)=>{
        return cache.addAll(APP_CONSTANT)
    })

    event.waitUntil(Promise.all([SHELL,CONSTANT]))
})

self.addEventListener('activate', (event) => {
    const next = caches.keys().then((keys)=>{
        keys.forEach((k)=>{
            if( k !== CACHE_SHELL && k.includes('shell') ){
                return caches.delete(k);
            }
        })
    })
    event.waitUntil(next)
})

self.addEventListener('fetch', (event)=>{
    const response = caches.match(event.request).then((r)=>{
        if(r) return r

        return fetch(event.request).then((newR)=>{
            return updateDynamicCache(CACHE_DYNAMIC,event.request,newR);
        })

    })

    event.respondWith(response)
})