jQueryMXNotice
==============

###[Демо-страница](http://milaxcom.github.io/jQueryQuickTips/demo/) | [Скачать](https://github.com/milaxcom/jQueryQuickTips/archive/gh-pages.zip)

jQuery Quick Tips предназначен для отображения всплывающих сообщений на странице с помощью JS.

####Преимущества
- Работа с любой версией jQuery начиная с 1.4.0 (тестировался на 1.11.0).
- Для стилей по-умолчанию не требуется подключение изображений и CSS.
- Совместим с ie6+.
- Установка параметров для вызова (в том числе в атрибутах тегов).
- Автоматическое подстраивание собщения под границу страницы.
- Доступны калбеки.

###Подключение

```html
<script type="text/javascript" src="js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="js/jquery.quicknotice.min.js"></script>
```

Используется FIX для ie6-8, который не показывает «стрелку», т. к. браузер не понимает rotate. Но FIX не будет срабатывать без jQuery-объекта $.browser, который был удален из версии jQ начиная с 1.9.0. Рекомендуется использовать сторонний планиг https://github.com/gabceb/jquery-browser-plugin.

###Использование

Для использования требуется добавить тегу class ```quick-tips```. При этом контент сообщения по-умолчанию будет браться из атрибута ```quick-tips```, а если атрибут отсутствует — с помощью функции .html().

```html
<!-- #1 -->
<div class="quick-tips" quick-tips="From left border"></div>
<!-- #2 -->
<div class="quick-tips">From left border</div>
```

#####Второй метод использования — это назначение своего класса и задание опций.

```html
<!-- HTML -->
<div class="my-hint" quick-tips="From left border"></div>
```

```js
/* JavaScript */
QuickTips(".my-hint", { "color" : "#FF0000", "background-color" : "#FFF" });
```

#####Опции можно так же задавать прямо в атрибутах.
```html
<!-- HTML -->
<div class="quick-tips" quick-tips="From left border" quick-tips-color="#FF0000" quick-tips-background-color="#FFFFFF"></div>
```

#####Доступные опции перечислены в объекте [QuickTips.defaultOptions](https://github.com/milaxcom/jQueryQuickTips/blob/gh-pages/jquery.quicktips.js).

#####Среди опций есть калбеки

- before (до отображения)
- after (после отображения)
- hide (после скрытия)

Пример использования before приведен на [демо странице](http://milaxcom.github.io/jQueryQuickTips/demo/). В центральном сообщении отображается текущее время.

#####Handler можно вызвать прямо из атрибута.
```html
<!-- HTML -->
<div class="quick-tips" quick-tips="From left border" quick-tips-before="myfunction"></div>
```
В данном примере калбек before исполнит глобальную функцию ```myfunction```.