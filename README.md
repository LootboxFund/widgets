# Lootbox Frontend

A template for building shareable libraries that can be used both NodeJS `import` or Browser `<script>` tags.

## Storybook

Views your modules locally in ESM format `import`.

```bash
$ yarn storybook
```

## Building

```bash
$ yarn install
$ yarn build
$ yarn publish	# publish to npm
```

## Usage Locally

Using npm libraries locally is easy using `$ yarn link`. You will need two repos, the library and the codebase you are working in.

```bash
# terminal 1
$ cd guildfx-frontend
$ yarn watch # this will hot-reload
```

```bash
# terminal 2
$ cd guildfx-frontend
$ yarn link # ready to use
$ yarn unlink # when you want to stop
```

```bash
# terminal 3
$ cd my-app
$ yarn link "@guildfx/frontend" # ready to use!
$ yarn unlink "@guildfx/frontend" # unlink when you want to go back to prod version
```

You will be able to now use the imports locally, without changing any code or imports.
Just be aware of local vs prod library imports when developing.

You can also build to UMD/IIFE locally, after `$ yarn watch` open up `./sandbox.html`

```html
<!-- Import Locally from build file -->
<script src="./iife/bundle.js" type="text/javascript"></script>
```

## Usage in server

```js
import { Counter, mockFunction } from '@guildfx/frontend'
const App = () => {
  mockFunction() // prints 'hello'
  return <Counter />
}
```

## Usage in the browser

```html
<!-- index.html -->
<head>
  <!-- we need to import react first -->
  <script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
</head>
<body>
  <!-- then import our components -->
  <div id="react-target"></div>
  <script src="https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/index.js?alt=media&token=ed98e790-1eab-4b7f-acc1-b06065975d69"></script>
  <!-- <script>
		// injects a react component into the page at <div id="react-target">
		Lootbox_UI.injectCounter()
	</script> -->
</body>
```

<details>

# @vijayt/counter

This is just a demo component, part of the boilerplate for putting together a project that publishes components to the NPM registry. Features of the boilerplate include: Compilation using Rollup and TypeScript, Unit / Functional testing using Jest and React Testing library, Visual testing using Storybook. There is a [tutorial](https://vijayt.com/post/boilerplate-for-publishing-components-with-a-storybook/) that explains how the project was put together.

</details>
