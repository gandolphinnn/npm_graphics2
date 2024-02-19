<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br>
<div align="center">
  <a href="https://github.com/gandolphinnn/npm_graphics2">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">npm_graphics2</h3>

  <p align="center">
    A high-level TypeScript framework availble on NPM to easily perform scripting on a canvas
    <br>
    <a href="https://github.com/gandolphinnn/npm_graphics2"><strong>Explore the docs »</strong></a>
    <br>  <br>
    <a href="https://github.com/gandolphinnn/npm_graphics2/issues">Report Bug</a>
    ·
    <a href="https://github.com/gandolphinnn/npm_graphics2/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
	<summary>Table of Contents</summary>
	<ol>
		<li><a href="#about-the-project">About The Project</a></li>
		<li>
			<a href="#getting-started">Getting Started</a>
			<ul>
				<li><a href="#installation">Installation</a></li>
			</ul>
		</li>
		<li>
			<a href="#usage">Usage</a>
			<ul>
				<li><a href="#style">Style</a></li>
				<li><a href="#index">Index</a></li>
			</ul>
		</li>
		<li><a href="#contributing">Contributing</a></li>
		<li><a href="#license">License</a></li>
	</ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Installation

This is an example of how to list things you need to use the software and how to install them.

- npm
  ```sh
  npm install @gandolphinnn/graphics2
  ```

<!-- USAGE EXAMPLES -->

## Usage

### Style.ts
<details>
<summary>Color</summary>
The Color class represents a color in RGBA format (Red, Green, Blue, Alpha).
The class also has three getter methods: hexStr, rgbaStr, and rgbaObj, which return the color in hexadecimal string format, RGBA string format, and RGBA object format, respectively.

The Color class must be called using its static methods, since the constructor is private.
- The byName method creates a Color from a color name.
- The byStr method creates a Color from an RGBA string.
- The byValues method creates a Color from individual RGBA values.
- The byObj method creates a Color from an RGBA object.
- The default method creates a Color using the default color (black, but can be modified).
</details>

<details>
<summary>Style</summary>
The Style class represents a style that can be applied to a canvas element.
It has 5 main properties: fillStyle, strokeStyle, lineWidth, textAlign, and font:
<table>
	<thead>
		<tr>
			<th>Property</th>
			<th>Type</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>fillStyle</td>
			<td>SubStyle</td>
		</tr>
		<tr>
			<td>strokeStyle</td>
			<td>SubStyle</td>
		</tr>
		<tr>
			<td>lineWidth</td>
			<td>number</td>
		</tr>
		<tr>
			<td>textAlign</td>
			<td>string</td>
		</tr>
		<tr>
			<td>font</td>
			<td>Font</td>
		</tr>
	</tbody>
</table>

The SubStyle type is a union type that can be a Color, CanvasGradient, or CanvasPattern.
The Font type is a string that represents a font in the format of ${number}px ${string}.

The Style class can also perform merge operations with other Style instances using the merge method: it is used to override the properties of the current Style with the properties of another Style.
Undefined properties are not overridden, null properties set the merged property to undefind.
The empty and default methods create an empty and default Style, respectively.
These methods return the Style instance itself, allowing the methods to be chained together.
</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request.
You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/gandolphinnn/npm_graphics2.svg?style=for-the-badge
[contributors-url]: https://github.com/gandolphinnn/npm_graphics2/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/gandolphinnn/npm_graphics2.svg?style=for-the-badge
[forks-url]: https://github.com/gandolphinnn/npm_graphics2/network/members
[stars-shield]: https://img.shields.io/github/stars/gandolphinnn/npm_graphics2.svg?style=for-the-badge
[stars-url]: https://github.com/gandolphinnn/npm_graphics2/stargazers
[issues-shield]: https://img.shields.io/github/issues/gandolphinnn/npm_graphics2.svg?style=for-the-badge
[issues-url]: https://github.com/gandolphinnn/npm_graphics2/issues
[license-shield]: https://img.shields.io/github/license/gandolphinnn/npm_graphics2.svg?style=for-the-badge
[license-url]: https://github.com/gandolphinnn/npm_graphics2/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/luca-gandolfi-531a93214
[product-screenshot]: demo.png