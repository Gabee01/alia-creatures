

# align-html-elements-to-3d.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Aligning HTML Elements to 3D</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Aligning HTML Elements to 3D">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Aligning HTML Elements to 3D</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This article is part of a series of articles about three.js. The first article
is <a href="fundamentals.html">three.js fundamentals</a>. If you haven't read that
yet and you're new to three.js you might want to consider starting there. </p>
<p>Sometimes you'd like to display some text in your 3D scene. You have many options
each with pluses and minuses.</p>
<ul>
<li><p>Use 3D text</p>
<p>If you look at the <a href="primitives.html">primitives article</a> you'll see <a href="/docs/#api/en/geometries/TextGeometry"><code class="notranslate" translate="no">TextGeometry</code></a> which
makes 3D text. This might be useful for flying logos but probably not so useful for stats, info,
or labelling lots of things.</p>
</li>
<li><p>Use a texture with 2D text drawn into it.</p>
<p>The article on <a href="canvas-textures.html">using a Canvas as a texture</a> shows using
a canvas as a texture. You can draw text into a canvas and <a href="billboards.html">display it as a billboard</a>.
The plus here might be that the text is integrated into the 3D scene. For something like a computer terminal
shown in a 3D scene this might be perfect.</p>
</li>
<li><p>Use HTML Elements and position them to match the 3D</p>
<p>The benefits to this approach is you can use all of HTML. Your HTML can have multiple elements. It can
by styled with CSS. It can also be selected by the user as it is actual text. </p>
</li>
</ul>
<p>This article will cover this last approach.</p>
<p>Let's start simple. We'll make a 3D scene with a few primitives and then add a label to each primitive. We'll start
with an example from <a href="responsive.html">the article on responsive pages</a> </p>
<p>We'll add some <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> like we did in <a href="lights.html">the article on lighting</a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import * as THREE from 'three';
+import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
</pre>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();
</pre>
<p>We need to provide an HTML element to contain our label elements</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;body&gt;
-  &lt;canvas id="c"&gt;&lt;/canvas&gt;
+  &lt;div id="container"&gt;
+    &lt;canvas id="c"&gt;&lt;/canvas&gt;
+    &lt;div id="labels"&gt;&lt;/div&gt;
+  &lt;/div&gt;
&lt;/body&gt;
</pre>
<p>By putting both the canvas and the <code class="notranslate" translate="no">&lt;div id="labels"&gt;</code> inside a
parent container we can make them overlap with this CSS</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">#c {
-    width: 100%;
-    height: 100%;
+    width: 100%;  /* let our container decide our size */
+    height: 100%;
    display: block;
}
+#container {
+  position: relative;  /* makes this the origin of its children */
+  width: 100%;
+  height: 100%;
+  overflow: hidden;
+}
+#labels {
+  position: absolute;  /* let us position ourself inside the container */
+  left: 0;             /* make our position the top left of the container */
+  top: 0;
+  color: white;
+}
</pre>
<p>let's also add some CSS for the labels themselves</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">#labels&gt;div {
  position: absolute;  /* let us position them inside the container */
  left: 0;             /* make their default position the top left of the container */
  top: 0;
  cursor: pointer;     /* change the cursor to a hand when over us */
  font-size: large;
  user-select: none;   /* don't let the text get selected */
  text-shadow:         /* create a black outline */
    -1px -1px 0 #000,
     0   -1px 0 #000,
     1px -1px 0 #000,
     1px  0   0 #000,
     1px  1px 0 #000,
     0    1px 0 #000,
    -1px  1px 0 #000,
    -1px  0   0 #000;
}
#labels&gt;div:hover {
  color: red;
}
</pre>
<p>Now into our code we don't have to add too much. We had a function
<code class="notranslate" translate="no">makeInstance</code> that we used to generate cubes. Let's make it
so it also adds a label element.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const labelContainerElem = document.querySelector('#labels');

-function makeInstance(geometry, color, x) {
+function makeInstance(geometry, color, x, name) {
  const material = new THREE.MeshPhongMaterial({color});

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.x = x;

+  const elem = document.createElement('div');
+  elem.textContent = name;
+  labelContainerElem.appendChild(elem);

-  return cube;
+  return {cube, elem};
}
</pre>
<p>As you can see we're adding a <code class="notranslate" translate="no">&lt;div&gt;</code> to the container, one for each cube. We're
also returning an object with both the <code class="notranslate" translate="no">cube</code> and the <code class="notranslate" translate="no">elem</code> for the label.</p>
<p>Calling it we need to provide a name for each</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const cubes = [
-  makeInstance(geometry, 0x44aa88,  0),
-  makeInstance(geometry, 0x8844aa, -2),
-  makeInstance(geometry, 0xaa8844,  2),
+  makeInstance(geometry, 0x44aa88,  0, 'Aqua'),
+  makeInstance(geometry, 0x8844aa, -2, 'Purple'),
+  makeInstance(geometry, 0xaa8844,  2, 'Gold'),
];
</pre>
<p>What remains is positioning the label elements at render time</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const tempV = new THREE.Vector3();

...

-cubes.forEach((cube, ndx) =&gt; {
+cubes.forEach((cubeInfo, ndx) =&gt; {
+  const {cube, elem} = cubeInfo;
  const speed = 1 + ndx * .1;
  const rot = time * speed;
  cube.rotation.x = rot;
  cube.rotation.y = rot;

+  // get the position of the center of the cube
+  cube.updateWorldMatrix(true, false);
+  cube.getWorldPosition(tempV);
+
+  // get the normalized screen coordinate of that position
+  // x and y will be in the -1 to +1 range with x = -1 being
+  // on the left and y = -1 being on the bottom
+  tempV.project(camera);
+
+  // convert the normalized position to CSS coordinates
+  const x = (tempV.x *  .5 + .5) * canvas.clientWidth;
+  const y = (tempV.y * -.5 + .5) * canvas.clientHeight;
+
+  // move the elem to that position
+  elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
});
</pre>
<p>And with that we have labels aligned to their corresponding objects.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/align-html-to-3d.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/align-html-to-3d.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>There are a couple of issues we probably want to deal with.</p>
<p>One is that if we rotate the objects so they overlap all the labels
overlap as well.</p>
<div class="threejs_center"><img src="../resources/images/overlapping-labels.png" style="width: 307px;"></div>

<p>Another is that if we zoom way out so that the objects go outside
the frustum the labels will still appear.</p>
<p>A possible solution to the problem of overlapping objects is to use
the <a href="picking.html">picking code from the article on picking</a>.
We'll pass in the position of the object on the screen and then
ask the <code class="notranslate" translate="no">RayCaster</code> to tell us which objects were intersected.
If our object is not the first one then we are not in the front.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const tempV = new THREE.Vector3();
+const raycaster = new THREE.Raycaster();

...

cubes.forEach((cubeInfo, ndx) =&gt; {
  const {cube, elem} = cubeInfo;
  const speed = 1 + ndx * .1;
  const rot = time * speed;
  cube.rotation.x = rot;
  cube.rotation.y = rot;

  // get the position of the center of the cube
  cube.updateWorldMatrix(true, false);
  cube.getWorldPosition(tempV);

  // get the normalized screen coordinate of that position
  // x and y will be in the -1 to +1 range with x = -1 being
  // on the left and y = -1 being on the bottom
  tempV.project(camera);

+  // ask the raycaster for all the objects that intersect
+  // from the eye toward this object's position
+  raycaster.setFromCamera(tempV, camera);
+  const intersectedObjects = raycaster.intersectObjects(scene.children);
+  // We're visible if the first intersection is this object.
+  const show = intersectedObjects.length &amp;&amp; cube === intersectedObjects[0].object;
+
+  if (!show) {
+    // hide the label
+    elem.style.display = 'none';
+  } else {
+    // un-hide the label
+    elem.style.display = '';

    // convert the normalized position to CSS coordinates
    const x = (tempV.x *  .5 + .5) * canvas.clientWidth;
    const y = (tempV.y * -.5 + .5) * canvas.clientHeight;

    // move the elem to that position
    elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
+  }
});
</pre>
<p>This handles overlapping.</p>
<p>To handle going outside the frustum we can add this check if the origin of
the object is outside the frustum by checking <code class="notranslate" translate="no">tempV.z</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-  if (!show) {
+  if (!show || Math.abs(tempV.z) &gt; 1) {
    // hide the label
    elem.style.display = 'none';
</pre>
<p>This <em>kind of</em> works because the normalized coordinates we computed include a <code class="notranslate" translate="no">z</code>
value that goes from -1 when at the <code class="notranslate" translate="no">near</code> part of our camera frustum to +1 when
at the <code class="notranslate" translate="no">far</code> part of our camera frustum.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/align-html-to-3d-w-hiding.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/align-html-to-3d-w-hiding.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>For the frustum check, the solution above fails as we're only checking the origin of the object. For a large
object. That origin might go outside the frustum but half of the object might still be in the frustum.</p>
<p>A more correct solution would be to check if the object itself is in the frustum
or not. Unfortunate that check is slow. For 3 cubes it will not be a problem
but for many objects it might be.</p>
<p>Three.js provides some functions to check if an object's bounding sphere is
in a frustum</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// at init time
const frustum = new THREE.Frustum();
const viewProjection = new THREE.Matrix4();

...

// before checking
camera.updateMatrix();
camera.updateMatrixWorld();
camera.matrixWorldInverse.copy(camera.matrixWorld).invert();

...

// then for each mesh
someMesh.updateMatrix();
someMesh.updateMatrixWorld();

viewProjection.multiplyMatrices(
    camera.projectionMatrix, camera.matrixWorldInverse);
frustum.setFromProjectionMatrix(viewProjection);
const inFrustum = frustum.contains(someMesh));
</pre>
<p>Our current overlapping solution has similar issues. Picking is slow. We could
use gpu based picking like we covered in the <a href="picking.html">picking
article</a> but that is also not free. Which solution you
chose depends on your needs.</p>
<p>Another issue is the order the labels appear. If we change the code to have
longer labels</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const cubes = [
-  makeInstance(geometry, 0x44aa88,  0, 'Aqua'),
-  makeInstance(geometry, 0x8844aa, -2, 'Purple'),
-  makeInstance(geometry, 0xaa8844,  2, 'Gold'),
+  makeInstance(geometry, 0x44aa88,  0, 'Aqua Colored Box'),
+  makeInstance(geometry, 0x8844aa, -2, 'Purple Colored Box'),
+  makeInstance(geometry, 0xaa8844,  2, 'Gold Colored Box'),
];
</pre>
<p>and set the CSS so these don't wrap</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">#labels&gt;div {
+  white-space: nowrap;
</pre>
<p>Then we can run into this issue</p>
<div class="threejs_center"><img src="../resources/images/label-sorting-issue.png" style="width: 401px;"></div>

<p>You can see above the purple box is in the back but its label is in front of the aqua box.</p>
<p>We can fix this by setting the <code class="notranslate" translate="no">zIndex</code> of each element. The projected position has a <code class="notranslate" translate="no">z</code> value
that goes from -1 in front to positive 1 in back. <code class="notranslate" translate="no">zIndex</code> is required to be an integer and goes the
opposite direction meaning for <code class="notranslate" translate="no">zIndex</code> greater values are in front so the following code should work.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// convert the normalized position to CSS coordinates
const x = (tempV.x *  .5 + .5) * canvas.clientWidth;
const y = (tempV.y * -.5 + .5) * canvas.clientHeight;

// move the elem to that position
elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;

+// set the zIndex for sorting
+elem.style.zIndex = (-tempV.z * .5 + .5) * 100000 | 0;
</pre>
<p>Because of the way the projected z value works we need to pick a large number to spread out the values
otherwise many will have the same value. To make sure the labels don't overlap with other parts of
the page we can tell the browser to create a new <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context">stacking context</a>
by setting the <code class="notranslate" translate="no">z-index</code> of the container of the labels</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">#labels {
  position: absolute;  /* let us position ourself inside the container */
+  z-index: 0;          /* make a new stacking context so children don't sort with rest of page */
  left: 0;             /* make our position the top left of the container */
  top: 0;
  color: white;
  z-index: 0;
}
</pre>
<p>and now the labels should always be in the correct order.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/align-html-to-3d-w-sorting.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/align-html-to-3d-w-sorting.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>While we're at it let's do one more example to show one more issue.
Let's draw a globe like Google Maps and label the countries.</p>
<p>I found <a href="http://thematicmapping.org/downloads/world_borders.php">this data</a>
which contains the borders of countries. It's licensed as
<a href="http://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>.</p>
<p>I <a href="https://github.com/mrdoob/three.js/blob/master/manual/resources/tools/geo-picking/">wrote some code</a>
to load the data, and generate country outlines and some JSON data with the names
of the countries and their locations.</p>
<div class="threejs_center"><img src="../examples/resources/data/world/country-outlines-4k.png" style="background: black; width: 700px"></div>

<p>The JSON data is an array of entries something like this</p>
<pre class="prettyprint showlinemods notranslate lang-json" translate="no">[
  {
    "name": "Algeria",
    "min": [
      -8.667223,
      18.976387
    ],
    "max": [
      11.986475,
      37.091385
    ],
    "area": 238174,
    "lat": 28.163,
    "lon": 2.632,
    "population": {
      "2005": 32854159
    }
  },
  ...
</pre>
<p>where min, max, lat, lon, are all in latitude and longitude degrees.</p>
<p>Let's load it up. The code is based on the examples from <a href="optimize-lots-of-objects.html">optimizing lots of
objects</a> though we are not drawing lots
of objects we'll be using the same solutions for <a href="rendering-on-demand.html">rendering on
demand</a>.</p>
<p>The first thing is to make a sphere and use the outline texture.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const loader = new THREE.TextureLoader();
  const texture = loader.load('resources/data/world/country-outlines-4k.png', render);
  const geometry = new THREE.SphereGeometry(1, 64, 32);
  const material = new THREE.MeshBasicMaterial({map: texture});
  scene.add(new THREE.Mesh(geometry, material));
}
</pre>
<p>Then let's load the JSON file by first making a loader</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">async function loadJSON(url) {
  const req = await fetch(url);
  return req.json();
}
</pre>
<p>and then calling it</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">let countryInfos;
async function loadCountryData() {
  countryInfos = await loadJSON('resources/data/world/country-info.json');
     ...
  }
  requestRenderIfNotRequested();
}
loadCountryData();
</pre>
<p>Now let's use that data to generate and place the labels.</p>
<p>In the article on <a href="optimize-lots-of-objects.html">optimizing lots of objects</a>
we had setup a small scene graph of helper objects to make it easy to
compute latitude and longitude positions on our globe. See that article
for an explanation of how they work.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const lonFudge = Math.PI * 1.5;
const latFudge = Math.PI;
// these helpers will make it easy to position the boxes
// We can rotate the lon helper on its Y axis to the longitude
const lonHelper = new THREE.Object3D();
// We rotate the latHelper on its X axis to the latitude
const latHelper = new THREE.Object3D();
lonHelper.add(latHelper);
// The position helper moves the object to the edge of the sphere
const positionHelper = new THREE.Object3D();
positionHelper.position.z = 1;
latHelper.add(positionHelper);
</pre>
<p>We'll use that to compute a position for each label</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const labelParentElem = document.querySelector('#labels');
for (const countryInfo of countryInfos) {
  const {lat, lon, name} = countryInfo;

  // adjust the helpers to point to the latitude and longitude
  lonHelper.rotation.y = THREE.MathUtils.degToRad(lon) + lonFudge;
  latHelper.rotation.x = THREE.MathUtils.degToRad(lat) + latFudge;

  // get the position of the lat/lon
  positionHelper.updateWorldMatrix(true, false);
  const position = new THREE.Vector3();
  positionHelper.getWorldPosition(position);
  countryInfo.position = position;

  // add an element for each country
  const elem = document.createElement('div');
  elem.textContent = name;
  labelParentElem.appendChild(elem);
  countryInfo.elem = elem;
</pre>
<p>The code above looks very similar to the code we wrote for making cube labels
making an element per label. When we're done we have an array, <code class="notranslate" translate="no">countryInfos</code>,
with one entry for each country to which we've added an <code class="notranslate" translate="no">elem</code> property for
the label element for that country and a <code class="notranslate" translate="no">position</code> with its position on the
globe.</p>
<p>Just like we did for the cubes we need to update the position of the
labels and render time.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const tempV = new THREE.Vector3();

function updateLabels() {
  // exit if we have not yet loaded the JSON file
  if (!countryInfos) {
    return;
  }

  for (const countryInfo of countryInfos) {
    const {position, elem} = countryInfo;

    // get the normalized screen coordinate of that position
    // x and y will be in the -1 to +1 range with x = -1 being
    // on the left and y = -1 being on the bottom
    tempV.copy(position);
    tempV.project(camera);

    // convert the normalized position to CSS coordinates
    const x = (tempV.x *  .5 + .5) * canvas.clientWidth;
    const y = (tempV.y * -.5 + .5) * canvas.clientHeight;

    // move the elem to that position
    elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;

    // set the zIndex for sorting
    elem.style.zIndex = (-tempV.z * .5 + .5) * 100000 | 0;
  }
}
</pre>
<p>You can see the code above is substantially similar to the cube example before.
The only major difference is we pre-computed the label positions at init time.
We can do this because the globe never moves. Only our camera moves.</p>
<p>Lastly we need to call <code class="notranslate" translate="no">updateLabels</code> in our render loop</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render() {
  renderRequested = false;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  controls.update();

+  updateLabels();

  renderer.render(scene, camera);
}
</pre>
<p>And this is what we get</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/align-html-elements-to-3d-globe-too-many-labels.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/align-html-elements-to-3d-globe-too-many-labels.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>That is way too many labels!</p>
<p>We have 2 problems.</p>
<ol>
<li><p>Labels facing away from us are showing up.</p>
</li>
<li><p>There are too many labels.</p>
</li>
</ol>
<p>For issue #1 we can't really use the <code class="notranslate" translate="no">RayCaster</code> like we did above as there is
nothing to intersect except the sphere. Instead what we can do is check if that
particular country is facing away from us or not. This works because the label
positions are around a sphere. In fact we're using a unit sphere, a sphere with
a radius of 1.0. That means the positions are already unit directions making
the math relatively easy.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const tempV = new THREE.Vector3();
+const cameraToPoint = new THREE.Vector3();
+const cameraPosition = new THREE.Vector3();
+const normalMatrix = new THREE.Matrix3();

function updateLabels() {
  // exit if we have not yet loaded the JSON file
  if (!countryInfos) {
    return;
  }

+  const minVisibleDot = 0.2;
+  // get a matrix that represents a relative orientation of the camera
+  normalMatrix.getNormalMatrix(camera.matrixWorldInverse);
+  // get the camera's position
+  camera.getWorldPosition(cameraPosition);
  for (const countryInfo of countryInfos) {
    const {position, elem} = countryInfo;

+    // Orient the position based on the camera's orientation.
+    // Since the sphere is at the origin and the sphere is a unit sphere
+    // this gives us a camera relative direction vector for the position.
+    tempV.copy(position);
+    tempV.applyMatrix3(normalMatrix);
+
+    // compute the direction to this position from the camera
+    cameraToPoint.copy(position);
+    cameraToPoint.applyMatrix4(camera.matrixWorldInverse).normalize();
+
+    // get the dot product of camera relative direction to this position
+    // on the globe with the direction from the camera to that point.
+    // 1 = facing directly towards the camera
+    // 0 = exactly on tangent of the sphere from the camera
+    // &lt; 0 = facing away
+    const dot = tempV.dot(cameraToPoint);
+
+    // if the orientation is not facing us hide it.
+    if (dot &lt; minVisibleDot) {
+      elem.style.display = 'none';
+      continue;
+    }
+
+    // restore the element to its default display style
+    elem.style.display = '';

    // get the normalized screen coordinate of that position
    // x and y will be in the -1 to +1 range with x = -1 being
    // on the left and y = -1 being on the bottom
    tempV.copy(position);
    tempV.project(camera);

    // convert the normalized position to CSS coordinates
    const x = (tempV.x *  .5 + .5) * canvas.clientWidth;
    const y = (tempV.y * -.5 + .5) * canvas.clientHeight;

    // move the elem to that position
    countryInfo.elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;

    // set the zIndex for sorting
    elem.style.zIndex = (-tempV.z * .5 + .5) * 100000 | 0;
  }
}
</pre>
<p>Above we use the positions as a direction and get that direction relative to the
camera. Then we get the camera relative direction from the camera to that
position on the globe and take the <em>dot product</em>. The dot product returns the cosine
of the angle between the to vectors. This gives us a value from -1
to +1 where -1 means the label is facing the camera, 0 means the label is directly
on the edge of the sphere relative to the camera, and anything greater than zero is
behind. We then use that value to show or hide the element.</p>
<div class="spread">
  <div>
    <div data-diagram="dotProduct" style="height: 400px"></div>
  </div>
</div>

<p>In the diagram above we can see the dot product of the direction the label is
facing to direction from the camera to that position. If you rotate the
direction you'll see the dot product is -1.0 when the direction is directly
facing the camera, it's 0.0 when exactly on the tangent of the sphere relative
to the camera or to put it another way it's 0 when the 2 vectors are
perpendicular to each other, 90 degrees It's greater than zero with the label is
behind the sphere.</p>
<p>For issue #2, too many labels we need some way to decide which labels
to show. One way would be to only show labels for large countries.
The data we're loading contains min and max values for the area a
country covers. From that we can compute an area and then use that
area to decide whether or not to display the country.</p>
<p>At init time let's compute the area</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const labelParentElem = document.querySelector('#labels');
for (const countryInfo of countryInfos) {
  const {lat, lon, min, max, name} = countryInfo;

  // adjust the helpers to point to the latitude and longitude
  lonHelper.rotation.y = THREE.MathUtils.degToRad(lon) + lonFudge;
  latHelper.rotation.x = THREE.MathUtils.degToRad(lat) + latFudge;

  // get the position of the lat/lon
  positionHelper.updateWorldMatrix(true, false);
  const position = new THREE.Vector3();
  positionHelper.getWorldPosition(position);
  countryInfo.position = position;

+  // compute the area for each country
+  const width = max[0] - min[0];
+  const height = max[1] - min[1];
+  const area = width * height;
+  countryInfo.area = area;

  // add an element for each country
  const elem = document.createElement('div');
  elem.textContent = name;
  labelParentElem.appendChild(elem);
  countryInfo.elem = elem;
}
</pre>
<p>Then at render time let's use the area to decide to display the label
or not</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const large = 20 * 20;
const maxVisibleDot = 0.2;
// get a matrix that represents a relative orientation of the camera
normalMatrix.getNormalMatrix(camera.matrixWorldInverse);
// get the camera's position
camera.getWorldPosition(cameraPosition);
for (const countryInfo of countryInfos) {
-  const {position, elem} = countryInfo;
+  const {position, elem, area} = countryInfo;
+  // large enough?
+  if (area &lt; large) {
+    elem.style.display = 'none';
+    continue;
+  }

  ...
</pre>
<p>Finally, since I'm not sure what good values are for these settings lets
add a GUI so we can play with them</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
+import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
</pre>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const settings = {
+  minArea: 20,
+  maxVisibleDot: -0.2,
+};
+const gui = new GUI({width: 300});
+gui.add(settings, 'minArea', 0, 50).onChange(requestRenderIfNotRequested);
+gui.add(settings, 'maxVisibleDot', -1, 1, 0.01).onChange(requestRenderIfNotRequested);

function updateLabels() {
  if (!countryInfos) {
    return;
  }

-  const large = 20 * 20;
-  const maxVisibleDot = -0.2;
+  const large = settings.minArea * settings.minArea;
  // get a matrix that represents a relative orientation of the camera
  normalMatrix.getNormalMatrix(camera.matrixWorldInverse);
  // get the camera's position
  camera.getWorldPosition(cameraPosition);
  for (const countryInfo of countryInfos) {

    ...

    // if the orientation is not facing us hide it.
-    if (dot &gt; maxVisibleDot) {
+    if (dot &gt; settings.maxVisibleDot) {
      elem.style.display = 'none';
      continue;
    }
</pre>
<p>and here's the result</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/align-html-elements-to-3d-globe.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/align-html-elements-to-3d-globe.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>You can see as you rotate the earth labels that go behind disappear.
Adjust the <code class="notranslate" translate="no">minVisibleDot</code> to see the cutoff change.
You can also adjust the <code class="notranslate" translate="no">minArea</code> value to see larger or smaller countries
appear.</p>
<p>The more I worked on this the more I realized just how much
work is put into Google Maps. They have also have to decide which labels to
show. I'm pretty sure they use all kinds of criteria. For example your current
location, your default language setting, your account settings if you have an
account, they probably use population or popularity, they might give priority
to the countries in the center of the view, etc ... Lots to think about.</p>
<p>In any case I hope these examples gave you some idea of how to align HTML
elements with your 3D. A few things I might change.</p>
<p>Next up let's make it so you can <a href="indexed-textures.html">pick and highlight a country</a>.</p>
<p><link rel="stylesheet" href="../resources/threejs-align-html-elements-to-3d.css"></p>
<script type="module" src="../resources/threejs-align-html-elements-to-3d.js"></script>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# backgrounds.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Backgrounds and Skyboxes</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Backgrounds and Skyboxes">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Backgrounds and Skyboxes</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>Most of the articles here use a solid color for a background.</p>
<p>Adding as static background can be as simple as setting some CSS. Taking
an example from <a href="responsive.html">the article on making THREE.js responsive</a>
we only need to change 2 things.</p>
<p>We need to add some CSS to our canvas to set its background to an image</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;style&gt;
body {
    margin: 0;
}
#c {
    width: 100%;
    height: 100%;
    display: block;
+    background: url(resources/images/daikanyama.jpg) no-repeat center center;
+    background-size: cover;
}
&lt;/style&gt;
</pre>
<p>and we need to tell the <a href="/docs/#api/en/renderers/WebGLRenderer"><code class="notranslate" translate="no">WebGLRenderer</code></a> to use <code class="notranslate" translate="no">alpha</code> so places we are not
drawing anything are transparent.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function main() {
  const canvas = document.querySelector('#c');
-  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
+  const renderer = new THREE.WebGLRenderer({
+    antialias: true,
+    canvas,
+    alpha: true,
+  });
</pre>
<p>And we get a background.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/background-css.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/background-css.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>If we want the background to be able to be affected by <a href="post-processing.html">post processing
effects</a> then we need to draw the background using
THREE.js.</p>
<p>THREE.js makes this some what simple. We can just set the background of the scene to
a texture.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const loader = new THREE.TextureLoader();
const bgTexture = loader.load('resources/images/daikanyama.jpg');
bgTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = bgTexture;
</pre>
<p>which gives us</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/background-scene-background.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/background-scene-background.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>This gets us a background image but its stretched to fit the screen.</p>
<p>We can solve this issue by setting the <code class="notranslate" translate="no">repeat</code> and <code class="notranslate" translate="no">offset</code> properties of
the texture to show only a portion of image.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {

   ...

+  // Set the repeat and offset properties of the background texture
+  // to keep the image's aspect correct.
+  // Note the image may not have loaded yet.
+  const canvasAspect = canvas.clientWidth / canvas.clientHeight;
+  const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
+  const aspect = imageAspect / canvasAspect;
+
+  bgTexture.offset.x = aspect &gt; 1 ? (1 - 1 / aspect) / 2 : 0;
+  bgTexture.repeat.x = aspect &gt; 1 ? 1 / aspect : 1;
+
+  bgTexture.offset.y = aspect &gt; 1 ? 0 : (1 - aspect) / 2;
+  bgTexture.repeat.y = aspect &gt; 1 ? 1 : aspect;

  ...

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
</pre>
<p>and now THREE.js drawing the background. There is no visible difference from
the CSS version at the top but now if we used a <a href="post-processing.html">post processing
effect</a> the background would be affected too.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/background-scene-background-fixed-aspect.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/background-scene-background-fixed-aspect.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Of course a static background is not usually what we want in a 3D scene. Instead
we usually want some kind of <em>skybox</em>. A skybox is just that, box with the sky
draw on it. We put the camera inside the box and it looks like there is a sky in
the background.</p>
<p>The most common way to implement a skybox is to make a cube, apply a texture to
it, draw it from the inside. On each side of the cube put a texture (using
texture coordinates) that looks like some image of the horizon. It's also often
common to use a sky sphere or a sky dome with a texture drawn on it. You can
probably figure that one out on your own. Just make a cube or sphere,
<a href="textures.html">apply a texture</a>, mark it as <code class="notranslate" translate="no">THREE.BackSide</code> so we
render the inside instead of the outside, and either put it in your scene directly
or like above, or, make 2 scenes, a special one to draw the skybox/sphere/dome and the
normal one to draw everything else. You'd use your normal <a href="/docs/#api/en/cameras/PerspectiveCamera"><code class="notranslate" translate="no">PerspectiveCamera</code></a> to
draw. No need for the <a href="/docs/#api/en/cameras/OrthographicCamera"><code class="notranslate" translate="no">OrthographicCamera</code></a>.</p>
<p>Another solution is to use a <em>Cubemap</em>. A Cubemap is a special kind of texture
that has 6 sides, the sides of a cube. Instead of using standard texture
coordinates it uses a direction from the center pointing outward to decide where
to get a color.</p>
<p>Here are the 6 images of a cubemap from the computer history museum in Mountain
View, California.</p>
<div class="threejs_center">
  <img src="../examples/resources/images/cubemaps/computer-history-museum/pos-x.jpg" style="width: 200px" class="border">
  <img src="../examples/resources/images/cubemaps/computer-history-museum/neg-x.jpg" style="width: 200px" class="border">
  <img src="../examples/resources/images/cubemaps/computer-history-museum/pos-y.jpg" style="width: 200px" class="border">
</div>
<div class="threejs_center">
  <img src="../examples/resources/images/cubemaps/computer-history-museum/neg-y.jpg" style="width: 200px" class="border">
  <img src="../examples/resources/images/cubemaps/computer-history-museum/pos-z.jpg" style="width: 200px" class="border">
  <img src="../examples/resources/images/cubemaps/computer-history-museum/neg-z.jpg" style="width: 200px" class="border">
</div>

<p>To use them we use <a href="/docs/#api/en/loaders/CubeTextureLoader"><code class="notranslate" translate="no">CubeTextureLoader</code></a> to load them and then use that as a the
scene's background.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    'resources/images/cubemaps/computer-history-museum/pos-x.jpg',
    'resources/images/cubemaps/computer-history-museum/neg-x.jpg',
    'resources/images/cubemaps/computer-history-museum/pos-y.jpg',
    'resources/images/cubemaps/computer-history-museum/neg-y.jpg',
    'resources/images/cubemaps/computer-history-museum/pos-z.jpg',
    'resources/images/cubemaps/computer-history-museum/neg-z.jpg',
  ]);
  scene.background = texture;
}
</pre>
<p>At render time we don't need to adjust the texture like we did above</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {

   ...

-  // Set the repeat and offset properties of the background texture
-  // to keep the image's aspect correct.
-  // Note the image may not have loaded yet.
-  const canvasAspect = canvas.clientWidth / canvas.clientHeight;
-  const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
-  const aspect = imageAspect / canvasAspect;
-
-  bgTexture.offset.x = aspect &gt; 1 ? (1 - 1 / aspect) / 2 : 0;
-  bgTexture.repeat.x = aspect &gt; 1 ? 1 / aspect : 1;
-
-  bgTexture.offset.y = aspect &gt; 1 ? 0 : (1 - aspect) / 2;
-  bgTexture.repeat.y = aspect &gt; 1 ? 1 : aspect;

  ...

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
</pre>
<p>Let's add some controls in so we can rotate the camera.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
</pre>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.1;
-const far = 5;
+const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
-camera.position.z = 2;
+camera.position.z = 3;

+const controls = new OrbitControls(camera, canvas);
+controls.target.set(0, 0, 0);
+controls.update();
</pre>
<p>and try it out. Drag on the example to rotate the camera and see the cubemap
surrounds us.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/background-cubemap.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/background-cubemap.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Another option is to use an Equirectangular map. This is the kind of picture a
<a href="https://google.com/search?q=360+camera">360 camera</a> takes.</p>
<p><a href="https://hdrihaven.com/hdri/?h=tears_of_steel_bridge">Here's one</a> I found from
<a href="https://hdrihaven.com">this site</a>.</p>
<div class="threejs_center"><img src="../examples/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg" style="width: 600px"></div>

<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
-  const loader = new THREE.CubeTextureLoader();
-  const texture = loader.load([
-    'resources/images/cubemaps/computer-history-museum/pos-x.jpg',
-    'resources/images/cubemaps/computer-history-museum/neg-x.jpg',
-    'resources/images/cubemaps/computer-history-museum/pos-y.jpg',
-    'resources/images/cubemaps/computer-history-museum/neg-y.jpg',
-    'resources/images/cubemaps/computer-history-museum/pos-z.jpg',
-    'resources/images/cubemaps/computer-history-museum/neg-z.jpg',
-  ]);
-  scene.background = texture;
+  const loader = new THREE.TextureLoader();
+  const texture = loader.load(
+    'resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
+    () =&gt; {
+      texture.mapping = THREE.EquirectangularReflectionMapping;
+      texture.colorSpace = THREE.SRGBColorSpace;
+      scene.background = texture;
+    });
}
</pre>
<p>And that's all there is to it.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/background-equirectangularmap.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/background-equirectangularmap.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Rather than do it at load time you can also convert an equirectangular image
to a cubemap beforehand. <a href="https://matheowis.github.io/HDRI-to-CubeMap/">Here's a site that will do it for you</a>.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# billboards.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Billboards</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Billboards">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Billboards</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>In <a href="canvas-textures.html">a previous article</a> we used a <a href="/docs/#api/en/textures/CanvasTexture"><code class="notranslate" translate="no">CanvasTexture</code></a>
to make labels / badges on characters. Sometimes we'd like to make labels or
other things that always face the camera. Three.js provides the <a href="/docs/#api/en/objects/Sprite"><code class="notranslate" translate="no">Sprite</code></a> and
<a href="/docs/#api/en/materials/SpriteMaterial"><code class="notranslate" translate="no">SpriteMaterial</code></a> to make this happen.</p>
<p>Let's change the badge example from <a href="canvas-textures.html">the article on canvas textures</a>
to use <a href="/docs/#api/en/objects/Sprite"><code class="notranslate" translate="no">Sprite</code></a> and <a href="/docs/#api/en/materials/SpriteMaterial"><code class="notranslate" translate="no">SpriteMaterial</code></a></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function makePerson(x, labelWidth, size, name, color) {
  const canvas = makeLabelCanvas(labelWidth, size, name);
  const texture = new THREE.CanvasTexture(canvas);
  // because our canvas is likely not a power of 2
  // in both dimensions set the filtering appropriately.
  texture.minFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

-  const labelMaterial = new THREE.MeshBasicMaterial({
+  const labelMaterial = new THREE.SpriteMaterial({
    map: texture,
-    side: THREE.DoubleSide,
    transparent: true,
  });

  const root = new THREE.Object3D();
  root.position.x = x;

  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  root.add(body);
  body.position.y = bodyHeight / 2;

  const head = new THREE.Mesh(headGeometry, bodyMaterial);
  root.add(head);
  head.position.y = bodyHeight + headRadius * 1.1;

-  const label = new THREE.Mesh(labelGeometry, labelMaterial);
+  const label = new THREE.Sprite(labelMaterial);
  root.add(label);
  label.position.y = bodyHeight * 4 / 5;
  label.position.z = bodyRadiusTop * 1.01;
</pre>
<p>and the labels now always face the camera</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/billboard-labels-w-sprites.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/billboard-labels-w-sprites.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>One problem is from certain angles the labels now intersect the
characters. </p>
<div class="threejs_center"><img src="../resources/images/billboard-label-z-issue.png" style="width: 455px;"></div>

<p>We can move the position of the labels to fix.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+// if units are meters then 0.01 here makes size
+// of the label into centimeters.
+const labelBaseScale = 0.01;
const label = new THREE.Sprite(labelMaterial);
root.add(label);
-label.position.y = bodyHeight * 4 / 5;
-label.position.z = bodyRadiusTop * 1.01;
+label.position.y = head.position.y + headRadius + size * labelBaseScale;

-// if units are meters then 0.01 here makes size
-// of the label into centimeters.
-const labelBaseScale = 0.01;
label.scale.x = canvas.width  * labelBaseScale;
label.scale.y = canvas.height * labelBaseScale;
</pre>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/billboard-labels-w-sprites-adjust-height.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/billboard-labels-w-sprites-adjust-height.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Another thing we can do with billboards is draw facades.</p>
<p>Instead of drawing 3D objects we draw 2D planes with an image
of 3D objects. This is often faster than drawing 3D objects.</p>
<p>For example let's make a scene with grid of trees. We'll make each
tree from a cylinder for the base and a cone for the top.</p>
<p>First we make the cone and cylinder geometry and materials that
all the trees will share</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const trunkRadius = .2;
const trunkHeight = 1;
const trunkRadialSegments = 12;
const trunkGeometry = new THREE.CylinderGeometry(
    trunkRadius, trunkRadius, trunkHeight, trunkRadialSegments);

const topRadius = trunkRadius * 4;
const topHeight = trunkHeight * 2;
const topSegments = 12;
const topGeometry = new THREE.ConeGeometry(
    topRadius, topHeight, topSegments);

const trunkMaterial = new THREE.MeshPhongMaterial({color: 'brown'});
const topMaterial = new THREE.MeshPhongMaterial({color: 'green'});
</pre>
<p>Then we'll make a function that makes a <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> each for the trunk and top
of a tree and parents both to an <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function makeTree(x, z) {
  const root = new THREE.Object3D();
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = trunkHeight / 2;
  root.add(trunk);

  const top = new THREE.Mesh(topGeometry, topMaterial);
  top.position.y = trunkHeight + topHeight / 2;
  root.add(top);

  root.position.set(x, 0, z);
  scene.add(root);

  return root;
}
</pre>
<p>Then we'll make a loop to place a grid of trees.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">for (let z = -50; z &lt;= 50; z += 10) {
  for (let x = -50; x &lt;= 50; x += 10) {
    makeTree(x, z);
  }
}
</pre>
<p>Let's also add a ground plane while we're at it</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// add ground
{
  const size = 400;
  const geometry = new THREE.PlaneGeometry(size, size);
  const material = new THREE.MeshPhongMaterial({color: 'gray'});
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI * -0.5;
  scene.add(mesh);
}
</pre>
<p>and change the background to light blue</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const scene = new THREE.Scene();
-scene.background = new THREE.Color('white');
+scene.background = new THREE.Color('lightblue');
</pre>
<p>and we get a grid of trees</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/billboard-trees-no-billboards.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/billboard-trees-no-billboards.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>There are 11x11 or 121 trees. Each tree is made from a 12 polygon
cone and a 48 polygon trunk so each tree is 60 polygons. 121 * 60
is 7260 polygons. That's not that many but of course a more detailed
3D tree might be 1000-3000 polygons. If they were 3000 polygons each
then 121 trees would be 363000 polygons to draw.</p>
<p>Using facades we can bring that number down.</p>
<p>We could manually create a facade in some painting program but let's write
some code to try to generate one.</p>
<p>Let's write some code to render an object to a texture
using a <code class="notranslate" translate="no">RenderTarget</code>. We covered rendering to a <code class="notranslate" translate="no">RenderTarget</code>
in <a href="rendertargets.html">the article on render targets</a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

  camera.position.copy(boxCenter);
  camera.position.z += distance;

  // pick some near and far values for the frustum that
  // will contain the box.
  camera.near = boxSize / 100;
  camera.far = boxSize * 100;

  camera.updateProjectionMatrix();
}

function makeSpriteTexture(textureSize, obj) {
  const rt = new THREE.WebGLRenderTarget(textureSize, textureSize);

  const aspect = 1;  // because the render target is square
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  scene.add(obj);

  // compute the box that contains obj
  const box = new THREE.Box3().setFromObject(obj);

  const boxSize = box.getSize(new THREE.Vector3());
  const boxCenter = box.getCenter(new THREE.Vector3());

  // set the camera to frame the box
  const fudge = 1.1;
  const size = Math.max(...boxSize.toArray()) * fudge;
  frameArea(size, size, boxCenter, camera);

  renderer.autoClear = false;
  renderer.setRenderTarget(rt);
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);
  renderer.autoClear = true;

  scene.remove(obj);

  return {
    position: boxCenter.multiplyScalar(fudge),
    scale: size,
    texture: rt.texture,
  };
}
</pre>
<p>Some things to note about the code above:</p>
<p>We're using the field of view (<code class="notranslate" translate="no">fov</code>) defined above this code.</p>
<p>We're computing a box that contains the tree the same way
we did in <a href="load-obj.html">the article on loading a .obj file</a>
with a few minor changes.</p>
<p>We call <code class="notranslate" translate="no">frameArea</code> again adapted <a href="load-obj.html">the article on loading a .obj file</a>.
In this case we compute how far the camera needs to be away from the object
given its field of view to contain the object. We then position the camera -z that distance
from the center of the box that contains the object.</p>
<p>We multiply the size we want to fit by 1.1 (<code class="notranslate" translate="no">fudge</code>) to make sure the tree fits
completely in the render target. The issue here is the size we're using to
calculate if the object fits in the camera's view is not taking into account
that the very edges of the object will end up dipping outside area we
calculated. We could compute how to make 100% of the box fit but that would
waste space as well so instead we just <em>fudge</em> it.</p>
<p>Then we render to the render target and remove the object from
the scene. </p>
<p>It's important to note we need the lights in the scene but we
need to make sure nothing else is in the scene.</p>
<p>We also need to not set a background color on the scene</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const scene = new THREE.Scene();
-scene.background = new THREE.Color('lightblue');
</pre>
<p>Finally we've made the texture we return it and the position and scale we
need to make the facade so that it will appear to be in the same place.</p>
<p>We then make a tree and call this code and pass it in</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// make billboard texture
const tree = makeTree(0, 0);
const facadeSize = 64;
const treeSpriteInfo = makeSpriteTexture(facadeSize, tree);
</pre>
<p>We can then make a grid of facades instead of a grid of tree models</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+function makeSprite(spriteInfo, x, z) {
+  const {texture, offset, scale} = spriteInfo;
+  const mat = new THREE.SpriteMaterial({
+    map: texture,
+    transparent: true,
+  });
+  const sprite = new THREE.Sprite(mat);
+  scene.add(sprite);
+  sprite.position.set(
+      offset.x + x,
+      offset.y,
+      offset.z + z);
+  sprite.scale.set(scale, scale, scale);
+}

for (let z = -50; z &lt;= 50; z += 10) {
  for (let x = -50; x &lt;= 50; x += 10) {
-    makeTree(x, z);
+    makeSprite(treeSpriteInfo, x, z);
  }
}
</pre>
<p>In the code above we apply the offset and scale needed to position the facade so it
appears the same place the original tree would have appeared.</p>
<p>Now that we're done making the tree facade texture we can set the background again</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">scene.background = new THREE.Color('lightblue');
</pre>
<p>and now we get a scene of tree facades</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/billboard-trees-static-billboards.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/billboard-trees-static-billboards.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Compare to the trees models above and you can see it looks fairly similar.
We used a low-res texture, just 64x64 pixels so the facades are blocky.
You could increase the resolution. Often facades are used only in the far
distance when they are fairly small so a low-res texture is enough and
it saves on drawing detailed trees that are only a few pixels big when
far away.</p>
<p>Another issue is we are only viewing the tree from one side. This is often
solved by rendering more facades, say from 8 directions around the object
and then setting which facade to show based on which direction the camera
is looking at the facade.</p>
<p>Whether or not you use facades is up to you but hopefully this article
gave you some ideas and suggested some solutions if you decide to use them.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# cameras.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Cameras</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Cameras">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Cameras</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This article is one in a series of articles about three.js.
The first article was <a href="fundamentals.html">about fundamentals</a>.
If you haven't read that yet you might want to start there.</p>
<p>Let's talk about cameras in three.js. We covered some of this in the <a href="fundamentals.html">first article</a> but we'll cover it in more detail here.</p>
<p>The most common camera in three.js and the one we've been using up to this point is
the <a href="/docs/#api/en/cameras/PerspectiveCamera"><code class="notranslate" translate="no">PerspectiveCamera</code></a>. It gives a 3d view where things in the distance appear
smaller than things up close.</p>
<p>The <a href="/docs/#api/en/cameras/PerspectiveCamera"><code class="notranslate" translate="no">PerspectiveCamera</code></a> defines a <em>frustum</em>. <a href="https://en.wikipedia.org/wiki/Frustum">A <em>frustum</em> is a solid pyramid shape with
the tip cut off</a>.
By name of a solid I mean for example a cube, a cone, a sphere, a cylinder,
and a frustum are all names of different kinds of solids.</p>
<div class="spread">
  <div><div data-diagram="shapeCube"></div><div>cube</div></div>
  <div><div data-diagram="shapeCone"></div><div>cone</div></div>
  <div><div data-diagram="shapeSphere"></div><div>sphere</div></div>
  <div><div data-diagram="shapeCylinder"></div><div>cylinder</div></div>
  <div><div data-diagram="shapeFrustum"></div><div>frustum</div></div>
</div>

<p>I only point that out because I didn't know it for years. Some book or page would mention
<em>frustum</em> and my eyes would glaze over. Understanding it's the name of a type of solid
shape made those descriptions suddenly make more sense 😅</p>
<p>A <a href="/docs/#api/en/cameras/PerspectiveCamera"><code class="notranslate" translate="no">PerspectiveCamera</code></a> defines its frustum based on 4 properties. <code class="notranslate" translate="no">near</code> defines where the
front of the frustum starts. <code class="notranslate" translate="no">far</code> defines where it ends. <code class="notranslate" translate="no">fov</code>, the field of view, defines
how tall the front and back of the frustum are by computing the correct height to get
the specified field of view at <code class="notranslate" translate="no">near</code> units from the camera. The <code class="notranslate" translate="no">aspect</code> defines how
wide the front and back of the frustum are. The width of the frustum is just the height
multiplied by the aspect.</p>
<p><img src="../resources/frustum-3d.svg" width="500" class="threejs_center"></p>
<p>Let's use the scene from <a href="lights.html">the previous article</a> that has a ground
plane, a sphere, and a cube and make it so we can adjust the camera's settings.</p>
<p>To do that we'll make a <code class="notranslate" translate="no">MinMaxGUIHelper</code> for the <code class="notranslate" translate="no">near</code> and <code class="notranslate" translate="no">far</code> settings so <code class="notranslate" translate="no">far</code>
is always greater than <code class="notranslate" translate="no">near</code>. It will have <code class="notranslate" translate="no">min</code> and <code class="notranslate" translate="no">max</code> properties that lil-gui
will adjust. When adjusted they'll set the 2 properties we specify.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class MinMaxGUIHelper {
  constructor(obj, minProp, maxProp, minDif) {
    this.obj = obj;
    this.minProp = minProp;
    this.maxProp = maxProp;
    this.minDif = minDif;
  }
  get min() {
    return this.obj[this.minProp];
  }
  set min(v) {
    this.obj[this.minProp] = v;
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
  }
  get max() {
    return this.obj[this.maxProp];
  }
  set max(v) {
    this.obj[this.maxProp] = v;
    this.min = this.min;  // this will call the min setter
  }
}
</pre>
<p>Now we can setup our GUI like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function updateCamera() {
  camera.updateProjectionMatrix();
}

const gui = new GUI();
gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);
</pre>
<p>Anytime the camera's settings change we need to call the camera's
<a href="/docs/#api/en/cameras/PerspectiveCamera#updateProjectionMatrix"><code class="notranslate" translate="no">updateProjectionMatrix</code></a> function
so we made a function called <code class="notranslate" translate="no">updateCamera</code> add passed it to lil-gui to call it when things change.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/cameras-perspective.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/cameras-perspective.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>You can adjust the values and see how they work. Note we didn't make <code class="notranslate" translate="no">aspect</code> settable since
it's taken from the size of the window so if you want to adjust the aspect open the example
in a new window and then size the window.</p>
<p>Still, I think it's a little hard to see so let's change the example so it has 2 cameras.
One will show our scene as we see it above, the other will show another camera looking at the
scene the first camera is drawing and showing that camera's frustum.</p>
<p>To do this we can use the scissor function of three.js.
Let's change it to draw 2 scenes with 2 cameras side by side using the scissor function</p>
<p>First off let's use some HTML and CSS to define 2 side by side elements. This will also
help us with events so both cameras can easily have their own <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a>.</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;body&gt;
  &lt;canvas id="c"&gt;&lt;/canvas&gt;
+  &lt;div class="split"&gt;
+     &lt;div id="view1" tabindex="1"&gt;&lt;/div&gt;
+     &lt;div id="view2" tabindex="2"&gt;&lt;/div&gt;
+  &lt;/div&gt;
&lt;/body&gt;
</pre>
<p>And the CSS that will make those 2 views show up side by side overlaid on top of
the canvas</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">.split {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
}
.split&gt;div {
  width: 100%;
  height: 100%;
}
</pre>
<p>Then in our code we'll add a <a href="/docs/#api/en/helpers/CameraHelper"><code class="notranslate" translate="no">CameraHelper</code></a>. A <a href="/docs/#api/en/helpers/CameraHelper"><code class="notranslate" translate="no">CameraHelper</code></a> draws the frustum for a <a href="/docs/#api/en/cameras/Camera"><code class="notranslate" translate="no">Camera</code></a></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const cameraHelper = new THREE.CameraHelper(camera);

...

scene.add(cameraHelper);
</pre>
<p>Now let's look up the 2 view elements.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const view1Elem = document.querySelector('#view1');
const view2Elem = document.querySelector('#view2');
</pre>
<p>And we'll set our existing <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> to respond to the first
view element only.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-const controls = new OrbitControls(camera, canvas);
+const controls = new OrbitControls(camera, view1Elem);
</pre>
<p>Let's make a second <a href="/docs/#api/en/cameras/PerspectiveCamera"><code class="notranslate" translate="no">PerspectiveCamera</code></a> and a second <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a>.
The second <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> is tied to the second camera and gets input
from the second view element.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const camera2 = new THREE.PerspectiveCamera(
  60,  // fov
  2,   // aspect
  0.1, // near
  500, // far
);
camera2.position.set(40, 10, 30);
camera2.lookAt(0, 5, 0);

const controls2 = new OrbitControls(camera2, view2Elem);
controls2.target.set(0, 5, 0);
controls2.update();
</pre>
<p>Finally we need to render the scene from the point of view of each
camera using the scissor function to only render to part of the canvas.</p>
<p>Here is a function that given an element will compute the rectangle
of that element that overlaps the canvas. It will then set the scissor
and viewport to that rectangle and return the aspect for that size.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function setScissorForElement(elem) {
  const canvasRect = canvas.getBoundingClientRect();
  const elemRect = elem.getBoundingClientRect();

  // compute a canvas relative rectangle
  const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
  const left = Math.max(0, elemRect.left - canvasRect.left);
  const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
  const top = Math.max(0, elemRect.top - canvasRect.top);

  const width = Math.min(canvasRect.width, right - left);
  const height = Math.min(canvasRect.height, bottom - top);

  // setup the scissor to only render to that part of the canvas
  const positiveYUpBottom = canvasRect.height - bottom;
  renderer.setScissor(left, positiveYUpBottom, width, height);
  renderer.setViewport(left, positiveYUpBottom, width, height);

  // return the aspect
  return width / height;
}
</pre>
<p>And now we can use that function to draw the scene twice in our <code class="notranslate" translate="no">render</code> function</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">  function render() {

-    if (resizeRendererToDisplaySize(renderer)) {
-      const canvas = renderer.domElement;
-      camera.aspect = canvas.clientWidth / canvas.clientHeight;
-      camera.updateProjectionMatrix();
-    }

+    resizeRendererToDisplaySize(renderer);
+
+    // turn on the scissor
+    renderer.setScissorTest(true);
+
+    // render the original view
+    {
+      const aspect = setScissorForElement(view1Elem);
+
+      // adjust the camera for this aspect
+      camera.aspect = aspect;
+      camera.updateProjectionMatrix();
+      cameraHelper.update();
+
+      // don't draw the camera helper in the original view
+      cameraHelper.visible = false;
+
+      scene.background.set(0x000000);
+
+      // render
+      renderer.render(scene, camera);
+    }
+
+    // render from the 2nd camera
+    {
+      const aspect = setScissorForElement(view2Elem);
+
+      // adjust the camera for this aspect
+      camera2.aspect = aspect;
+      camera2.updateProjectionMatrix();
+
+      // draw the camera helper in the 2nd view
+      cameraHelper.visible = true;
+
+      scene.background.set(0x000040);
+
+      renderer.render(scene, camera2);
+    }

-    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
</pre>
<p>The code above sets the background color of the scene when rendering the
second view to dark blue just to make it easier to distinguish the two views.</p>
<p>We can also remove our <code class="notranslate" translate="no">updateCamera</code> code since we're updating everything
in the <code class="notranslate" translate="no">render</code> function.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-function updateCamera() {
-  camera.updateProjectionMatrix();
-}

const gui = new GUI();
-gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
+gui.add(camera, 'fov', 1, 180);
const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
-gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
-gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);
+gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near');
+gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far');
</pre>
<p>And now you can use one view to see the frustum of the other.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/cameras-perspective-2-scenes.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/cameras-perspective-2-scenes.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>On the left you can see the original view and on the right you can
see a view showing the frustum of the camera on the left. As you adjust
<code class="notranslate" translate="no">near</code>, <code class="notranslate" translate="no">far</code>, <code class="notranslate" translate="no">fov</code> and move the camera with mouse you can see that
only what's inside the frustum shown on the right appears in the scene on
the left.</p>
<p>Adjust <code class="notranslate" translate="no">near</code> up to around 20 and you'll easily see the front of objects
disappear as they are no longer in the frustum. Adjust <code class="notranslate" translate="no">far</code> below about 35
and you'll start to see the ground plane disappear as it's no longer in
the frustum.</p>
<p>This brings up the question, why not just set <code class="notranslate" translate="no">near</code> to 0.0000000001 and <code class="notranslate" translate="no">far</code>
to 10000000000000 or something like that so you can just see everything?
The reason is your GPU only has so much precision to decide if something
is in front or behind something else. That precision is spread out between
<code class="notranslate" translate="no">near</code> and <code class="notranslate" translate="no">far</code>. Worse, by default the precision close the camera is detailed
and the precision far from the camera is coarse. The units start with <code class="notranslate" translate="no">near</code>
and slowly expand as they approach <code class="notranslate" translate="no">far</code>.</p>
<p>Starting with the top example, let's change the code to insert 20 spheres in a
row.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  const numSpheres = 20;
  for (let i = 0; i &lt; numSpheres; ++i) {
    const sphereMat = new THREE.MeshPhongMaterial();
    sphereMat.color.setHSL(i * .73, 1, 0.5);
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, i * sphereRadius * -2.2);
    scene.add(mesh);
  }
}
</pre>
<p>and let's set <code class="notranslate" translate="no">near</code> to 0.00001</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const fov = 45;
const aspect = 2;  // the canvas default
-const near = 0.1;
+const near = 0.00001;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
</pre>
<p>We also need to tweak the GUI code a little to allow 0.00001 if the value is edited</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
+gui.add(minMaxGUIHelper, 'min', 0.00001, 50, 0.00001).name('near').onChange(updateCamera);
</pre>
<p>What do you think will happen?</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/cameras-z-fighting.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/cameras-z-fighting.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>This is an example of <em>z fighting</em> where the GPU on your computer does not have
enough precision to decide which pixels are in front and which pixels are behind.</p>
<p>Just in case the issue doesn't show on your machine here's what I see on mine</p>
<div class="threejs_center"><img src="../resources/images/z-fighting.png" style="width: 570px;"></div>

<p>One solution is to tell three.js use to a different method to compute which
pixels are in front and which are behind. We can do that by enabling
<code class="notranslate" translate="no">logarithmicDepthBuffer</code> when we create the <a href="/docs/#api/en/renderers/WebGLRenderer"><code class="notranslate" translate="no">WebGLRenderer</code></a></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
+const renderer = new THREE.WebGLRenderer({
+  antialias: true,
+  canvas,
+  logarithmicDepthBuffer: true,
+});
</pre>
<p>and with that it might work</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/cameras-logarithmic-depth-buffer.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/cameras-logarithmic-depth-buffer.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>If this didn't fix the issue for you then you've run into one reason why
you can't always use this solution. That reason is because only certain GPUs
support it. As of September 2018 almost no mobile devices support this
solution whereas most desktops do.</p>
<p>Another reason not to choose this solution is it can be significantly slower
than the standard solution.</p>
<p>Even with this solution there is still limited resolution. Make <code class="notranslate" translate="no">near</code> even
smaller or <code class="notranslate" translate="no">far</code> even bigger and you'll eventually run into the same issues.</p>
<p>What that means is that you should always make an effort to choose a <code class="notranslate" translate="no">near</code>
and <code class="notranslate" translate="no">far</code> setting that fits your use case. Set <code class="notranslate" translate="no">near</code> as far away from the camera
as you can and not have things disappear. Set <code class="notranslate" translate="no">far</code> as close to the camera
as you can and not have things disappear. If you're trying to draw a giant
scene and show a close up of someone's face so you can see their eyelashes
while in the background you can see all the way to mountains 50 kilometers
in the distance well then you'll need to find other creative solutions that
maybe we'll go over later. For now, just be aware you should take care
to choose appropriate <code class="notranslate" translate="no">near</code> and <code class="notranslate" translate="no">far</code> values for your needs.</p>
<p>The 2nd most common camera is the <a href="/docs/#api/en/cameras/OrthographicCamera"><code class="notranslate" translate="no">OrthographicCamera</code></a>. Rather than
specify a frustum it specifies a box with the settings <code class="notranslate" translate="no">left</code>, <code class="notranslate" translate="no">right</code>
<code class="notranslate" translate="no">top</code>, <code class="notranslate" translate="no">bottom</code>, <code class="notranslate" translate="no">near</code>, and <code class="notranslate" translate="no">far</code>. Because it's projecting a box
there is no perspective.</p>
<p>Let's change the 2 view example above to use an <a href="/docs/#api/en/cameras/OrthographicCamera"><code class="notranslate" translate="no">OrthographicCamera</code></a>
in the first view.</p>
<p>First let's setup an <a href="/docs/#api/en/cameras/OrthographicCamera"><code class="notranslate" translate="no">OrthographicCamera</code></a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const left = -1;
const right = 1;
const top = 1;
const bottom = -1;
const near = 5;
const far = 50;
const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
camera.zoom = 0.2;
</pre>
<p>We set <code class="notranslate" translate="no">left</code> and <code class="notranslate" translate="no">bottom</code> to -1 and <code class="notranslate" translate="no">right</code> and <code class="notranslate" translate="no">top</code> to 1. This would make
a box 2 units wide and 2 units tall but we're going to adjust the <code class="notranslate" translate="no">left</code> and <code class="notranslate" translate="no">top</code>
by the aspect of the rectangle we're drawing to. We'll use the <code class="notranslate" translate="no">zoom</code> property
to make it easy to adjust how many units are actually shown by the camera.</p>
<p>Let's add a GUI setting for <code class="notranslate" translate="no">zoom</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const gui = new GUI();
+gui.add(camera, 'zoom', 0.01, 1, 0.01).listen();
</pre>
<p>The call to <code class="notranslate" translate="no">listen</code> tells lil-gui to watch for changes. This is here because
the <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> can also control zoom. For example the scroll wheel on
a mouse will zoom via the <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a>.</p>
<p>Last we just need to change the part that renders the left
side to update the <a href="/docs/#api/en/cameras/OrthographicCamera"><code class="notranslate" translate="no">OrthographicCamera</code></a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const aspect = setScissorForElement(view1Elem);

  // update the camera for this aspect
-  camera.aspect = aspect;
+  camera.left   = -aspect;
+  camera.right  =  aspect;
  camera.updateProjectionMatrix();
  cameraHelper.update();

  // don't draw the camera helper in the original view
  cameraHelper.visible = false;

  scene.background.set(0x000000);
  renderer.render(scene, camera);
}
</pre>
<p>and now you can see an <a href="/docs/#api/en/cameras/OrthographicCamera"><code class="notranslate" translate="no">OrthographicCamera</code></a> at work.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/cameras-orthographic-2-scenes.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/cameras-orthographic-2-scenes.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>An <a href="/docs/#api/en/cameras/OrthographicCamera"><code class="notranslate" translate="no">OrthographicCamera</code></a> is most often used if using three.js
to draw 2D things. You'd decide how many units you want the camera
to show. For example if you want one pixel of canvas to match
one unit in the camera you could do something like</p>
<p>To put the origin at the center and have 1 pixel = 1 three.js unit
something like</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">camera.left = -canvas.width / 2;
camera.right = canvas.width / 2;
camera.top = canvas.height / 2;
camera.bottom = -canvas.height / 2;
camera.near = -1;
camera.far = 1;
camera.zoom = 1;
</pre>
<p>Or if we wanted the origin to be in the top left just like a
2D canvas we could use this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">camera.left = 0;
camera.right = canvas.width;
camera.top = 0;
camera.bottom = canvas.height;
camera.near = -1;
camera.far = 1;
camera.zoom = 1;
</pre>
<p>In which case the top left corner would be 0,0 just like a 2D canvas</p>
<p>Let's try it! First let's set the camera up</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const left = 0;
const right = 300;  // default canvas size
const top = 0;
const bottom = 150;  // default canvas size
const near = -1;
const far = 1;
const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
camera.zoom = 1;
</pre>
<p>Then let's load 6 textures and make 6 planes, one for each texture.
We'll parent each plane to a <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">THREE.Object3D</code></a> to make it easy to offset
the plane so its center appears to be at its top left corner.</p>
<p>If you're running locally you'll also need to have <a href="setup.html">setup</a>.
You might also want to read about <a href="textures.html">using textures</a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const loader = new THREE.TextureLoader();
const textures = [
  loader.load('resources/images/flower-1.jpg'),
  loader.load('resources/images/flower-2.jpg'),
  loader.load('resources/images/flower-3.jpg'),
  loader.load('resources/images/flower-4.jpg'),
  loader.load('resources/images/flower-5.jpg'),
  loader.load('resources/images/flower-6.jpg'),
];
const planeSize = 256;
const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planes = textures.map((texture) =&gt; {
  const planePivot = new THREE.Object3D();
  scene.add(planePivot);
  texture.magFilter = THREE.NearestFilter;
  const planeMat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(planeGeo, planeMat);
  planePivot.add(mesh);
  // move plane so top left corner is origin
  mesh.position.set(planeSize / 2, planeSize / 2, 0);
  return planePivot;
});
</pre>
<p>and we need to update the camera if the size of the canvas
changes.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render() {

  if (resizeRendererToDisplaySize(renderer)) {
    camera.right = canvas.width;
    camera.bottom = canvas.height;
    camera.updateProjectionMatrix();
  }

  ...
</pre>
<p><code class="notranslate" translate="no">planes</code> is an array of <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">THREE.Mesh</code></a>, one for each plane.
Let's move them around based on the time.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {
  time *= 0.001;  // convert to seconds;

  ...

  const distAcross = Math.max(20, canvas.width - planeSize);
  const distDown = Math.max(20, canvas.height - planeSize);

  // total distance to move across and back
  const xRange = distAcross * 2;
  const yRange = distDown * 2;
  const speed = 180;

  planes.forEach((plane, ndx) =&gt; {
    // compute a unique time for each plane
    const t = time * speed + ndx * 300;

    // get a value between 0 and range
    const xt = t % xRange;
    const yt = t % yRange;

    // set our position going forward if 0 to half of range
    // and backward if half of range to range
    const x = xt &lt; distAcross ? xt : xRange - xt;
    const y = yt &lt; distDown   ? yt : yRange - yt;

    plane.position.set(x, y, 0);
  });

  renderer.render(scene, camera);
</pre>
<p>And you can see the images bounce pixel perfect off the edges of the
canvas using pixel math just like a 2D canvas</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/cameras-orthographic-canvas-top-left-origin.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/cameras-orthographic-canvas-top-left-origin.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Another common use for an <a href="/docs/#api/en/cameras/OrthographicCamera"><code class="notranslate" translate="no">OrthographicCamera</code></a> is to draw the
up, down, left, right, front, back views of a 3D modeling
program or a game engine's editor.</p>
<div class="threejs_center"><img src="../resources/images/quad-viewport.png" style="width: 574px;"></div>

<p>In the screenshot above you can see 1 view is a perspective view and 3 views are
orthographic views.</p>
<p>That's the fundamentals of cameras. We'll cover a few common ways to move cameras
in other articles. For now let's move on to <a href="shadows.html">shadows</a>.</p>
<p><canvas id="c"></canvas></p>
<script type="module" src="../resources/threejs-cameras.js"></script>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# canvas-textures.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Canvas Textures</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Canvas Textures">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Canvas Textures</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This article continues from <a href="textures.html">the article on textures</a>.
If you haven't read that yet you should probably start there.</p>
<p>In <a href="textures.html">the previous article on textures</a> we mostly used
image files for textures. Sometimes though we want to generate a texture
at runtime. One way to do this is to use a <a href="/docs/#api/en/textures/CanvasTexture"><code class="notranslate" translate="no">CanvasTexture</code></a>.</p>
<p>A canvas texture takes a <code class="notranslate" translate="no">&lt;canvas&gt;</code> as its input. If you don't know how to
draw with the 2D canvas API on a canvas <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial">there's a good tutorial on MDN</a>.</p>
<p>Let's make a simple canvas program. Here's one that draws dots at random places in random colors.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const ctx = document.createElement('canvas').getContext('2d');
document.body.appendChild(ctx.canvas);
ctx.canvas.width = 256;
ctx.canvas.height = 256;
ctx.fillStyle = '#FFF';
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

function randInt(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min | 0;
}

function drawRandomDot() {
  ctx.fillStyle = `#${randInt(0x1000000).toString(16).padStart(6, '0')}`;
  ctx.beginPath();

  const x = randInt(256);
  const y = randInt(256);
  const radius = randInt(10, 64);
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function render() {
  drawRandomDot();
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
</pre>
<p>it's pretty straight forward.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/canvas-random-dots.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/canvas-random-dots.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Now let's use it to texture something. We'll start with the example of texturing
a cube from <a href="textures.html">the previous article</a>.
We'll remove the code that loads an image and instead use
our canvas by creating a <a href="/docs/#api/en/textures/CanvasTexture"><code class="notranslate" translate="no">CanvasTexture</code></a> and passing it the canvas we created.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const cubes = [];  // just an array we can use to rotate the cubes
-const loader = new THREE.TextureLoader();
-
+const ctx = document.createElement('canvas').getContext('2d');
+ctx.canvas.width = 256;
+ctx.canvas.height = 256;
+ctx.fillStyle = '#FFF';
+ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
+const texture = new THREE.CanvasTexture(ctx.canvas);

const material = new THREE.MeshBasicMaterial({
-  map: loader.load('resources/images/wall.jpg'),
+  map: texture,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
cubes.push(cube);  // add to our list of cubes to rotate
</pre>
<p>And then call the code to draw a random dot in our render loop</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {
  time *= 0.001;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

+  drawRandomDot();
+  texture.needsUpdate = true;

  cubes.forEach((cube, ndx) =&gt; {
    const speed = .2 + ndx * .1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
</pre>
<p>The only extra thing we need to do is set the <code class="notranslate" translate="no">needsUpdate</code> property
of the <a href="/docs/#api/en/textures/CanvasTexture"><code class="notranslate" translate="no">CanvasTexture</code></a> to tell three.js to update the texture with
the latest contents of the canvas.</p>
<p>And with that we have a canvas textured cube</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/canvas-textured-cube.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/canvas-textured-cube.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Note that if you want to use three.js to draw into the canvas you're
better off using a <code class="notranslate" translate="no">RenderTarget</code> which is covered in <a href="rendertargets.html">this article</a>.</p>
<p>A common use case for canvas textures is to provide text in a scene.
For example if you wanted to put a person's name on their character's
badge you might use a canvas texture to texture the badge.</p>
<p>Let's make a scene with 3 people and give each person a badge
or label.</p>
<p>Let's take the example above and remove all the cube related
stuff. Then let's set the background to white and add two <a href="lights.html">lights</a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const scene = new THREE.Scene();
+scene.background = new THREE.Color('white');
+
+function addLight(position) {
+  const color = 0xFFFFFF;
+  const intensity = 1;
+  const light = new THREE.DirectionalLight(color, intensity);
+  light.position.set(...position);
+  scene.add(light);
+  scene.add(light.target);
+}
+addLight([-3, 1, 1]);
+addLight([ 2, 1, .5]);
</pre>
<p>Let's make some code to make a label using canvas 2D</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+function makeLabelCanvas(size, name) {
+  const borderSize = 2;
+  const ctx = document.createElement('canvas').getContext('2d');
+  const font =  `${size}px bold sans-serif`;
+  ctx.font = font;
+  // measure how long the name will be
+  const doubleBorderSize = borderSize * 2;
+  const width = ctx.measureText(name).width + doubleBorderSize;
+  const height = size + doubleBorderSize;
+  ctx.canvas.width = width;
+  ctx.canvas.height = height;
+
+  // need to set font again after resizing canvas
+  ctx.font = font;
+  ctx.textBaseline = 'top';
+
+  ctx.fillStyle = 'blue';
+  ctx.fillRect(0, 0, width, height);
+  ctx.fillStyle = 'white';
+  ctx.fillText(name, borderSize, borderSize);
+
+  return ctx.canvas;
+}
</pre>
<p>Then we'll make simple people from a cylinder for the body, a sphere
for the head, and a plane for the label.</p>
<p>First let's make the shared geometry.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const bodyRadiusTop = .4;
+const bodyRadiusBottom = .2;
+const bodyHeight = 2;
+const bodyRadialSegments = 6;
+const bodyGeometry = new THREE.CylinderGeometry(
+    bodyRadiusTop, bodyRadiusBottom, bodyHeight, bodyRadialSegments);
+
+const headRadius = bodyRadiusTop * 0.8;
+const headLonSegments = 12;
+const headLatSegments = 5;
+const headGeometry = new THREE.SphereGeometry(
+    headRadius, headLonSegments, headLatSegments);
+
+const labelGeometry = new THREE.PlaneGeometry(1, 1);
</pre>
<p>Then let's make a function to build a person from these
parts.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+function makePerson(x, size, name, color) {
+  const canvas = makeLabelCanvas(size, name);
+  const texture = new THREE.CanvasTexture(canvas);
+  // because our canvas is likely not a power of 2
+  // in both dimensions set the filtering appropriately.
+  texture.minFilter = THREE.LinearFilter;
+  texture.wrapS = THREE.ClampToEdgeWrapping;
+  texture.wrapT = THREE.ClampToEdgeWrapping;
+
+  const labelMaterial = new THREE.MeshBasicMaterial({
+    map: texture,
+    side: THREE.DoubleSide,
+    transparent: true,
+  });
+  const bodyMaterial = new THREE.MeshPhongMaterial({
+    color,
+    flatShading: true,
+  });
+
+  const root = new THREE.Object3D();
+  root.position.x = x;
+
+  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
+  root.add(body);
+  body.position.y = bodyHeight / 2;
+
+  const head = new THREE.Mesh(headGeometry, bodyMaterial);
+  root.add(head);
+  head.position.y = bodyHeight + headRadius * 1.1;
+
+  const label = new THREE.Mesh(labelGeometry, labelMaterial);
+  root.add(label);
+  label.position.y = bodyHeight * 4 / 5;
+  label.position.z = bodyRadiusTop * 1.01;
+
+  // if units are meters then 0.01 here makes size
+  // of the label into centimeters.
+  const labelBaseScale = 0.01;
+  label.scale.x = canvas.width  * labelBaseScale;
+  label.scale.y = canvas.height * labelBaseScale;
+
+  scene.add(root);
+  return root;
+}
</pre>
<p>You can see above we put the body, head, and label on a root
<a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> and adjust their positions. This would let us move the
root object if we wanted to move the people. The body is 2 units
high. If 1 unit equals 1 meter then the code above tries to
make the label in centimeters so they will be size centimeters
tall and however wide is needed to fit the text.</p>
<p>We can then make people with labels</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+makePerson(-3, 32, 'Purple People Eater', 'purple');
+makePerson(-0, 32, 'Green Machine', 'green');
+makePerson(+3, 32, 'Red Menace', 'red');
</pre>
<p>What's left is to add some <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> so we can move
the camera.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import * as THREE from 'three';
+import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
</pre>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.1;
-const far = 5;
+const far = 50;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
-camera.position.z = 2;
+camera.position.set(0, 2, 5);

+const controls = new OrbitControls(camera, canvas);
+controls.target.set(0, 2, 0);
+controls.update();
</pre>
<p>and we get simple labels.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/canvas-textured-labels.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/canvas-textured-labels.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Some things to notice.</p>
<ul>
<li>If you zoom in the labels get pretty low-res.</li>
</ul>
<p>There is no easy solution. There are more complex font
rendering techniques but I know of no plugin solutions.
Plus they will require the user download font data which
would be slow.</p>
<p>One solution is to increase the resolution of the labels.
Try setting the size passed into to double what it is now
and setting <code class="notranslate" translate="no">labelBaseScale</code> to half what it currently is.</p>
<ul>
<li>The labels get longer the longer the name.</li>
</ul>
<p>If you wanted to fix this you'd instead choose a fixed sized
label and then squish the text.</p>
<p>This is pretty easy. Pass in a base width and scale the text to fit that
width like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-function makeLabelCanvas(size, name) {
+function makeLabelCanvas(baseWidth, size, name) {
  const borderSize = 2;
  const ctx = document.createElement('canvas').getContext('2d');
  const font =  `${size}px bold sans-serif`;
  ctx.font = font;
  // measure how long the name will be
+  const textWidth = ctx.measureText(name).width;

  const doubleBorderSize = borderSize * 2;
-  const width = ctx.measureText(name).width + doubleBorderSize;
+  const width = baseWidth + doubleBorderSize;
  const height = size + doubleBorderSize;
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  // need to set font again after resizing canvas
  ctx.font = font;
-  ctx.textBaseline = 'top';
+  ctx.textBaseline = 'middle';
+  ctx.textAlign = 'center';

  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, width, height);

+  // scale to fit but don't stretch
+  const scaleFactor = Math.min(1, baseWidth / textWidth);
+  ctx.translate(width / 2, height / 2);
+  ctx.scale(scaleFactor, 1);
  ctx.fillStyle = 'white';
  ctx.fillText(name, borderSize, borderSize);

  return ctx.canvas;
}
</pre>
<p>Then we can pass in a width for the labels</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-function makePerson(x, size, name, color) {
-  const canvas = makeLabelCanvas(size, name);
+function makePerson(x, labelWidth, size, name, color) {
+  const canvas = makeLabelCanvas(labelWidth, size, name);

...

}

-makePerson(-3, 32, 'Purple People Eater', 'purple');
-makePerson(-0, 32, 'Green Machine', 'green');
-makePerson(+3, 32, 'Red Menace', 'red');
+makePerson(-3, 150, 32, 'Purple People Eater', 'purple');
+makePerson(-0, 150, 32, 'Green Machine', 'green');
+makePerson(+3, 150, 32, 'Red Menace', 'red');
</pre>
<p>and we get labels where the text is centered and scaled to fit</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/canvas-textured-labels-scale-to-fit.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/canvas-textured-labels-scale-to-fit.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Above we used a new canvas for each texture. Whether or not to use a
canvas per texture is up to you. If you need to update them often then
having one canvas per texture is probably the best option. If they are
rarely or never updated then you can choose to use a single canvas
for multiple textures by forcing three.js to use the texture.
Let's change the code above to do just that.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const ctx = document.createElement('canvas').getContext('2d');

function makeLabelCanvas(baseWidth, size, name) {
  const borderSize = 2;
-  const ctx = document.createElement('canvas').getContext('2d');
  const font =  `${size}px bold sans-serif`;

  ...

}

+const forceTextureInitialization = function() {
+  const material = new THREE.MeshBasicMaterial();
+  const geometry = new THREE.PlaneGeometry();
+  const scene = new THREE.Scene();
+  scene.add(new THREE.Mesh(geometry, material));
+  const camera = new THREE.Camera();
+
+  return function forceTextureInitialization(texture) {
+    material.map = texture;
+    renderer.render(scene, camera);
+  };
+}();

function makePerson(x, labelWidth, size, name, color) {
  const canvas = makeLabelCanvas(labelWidth, size, name);
  const texture = new THREE.CanvasTexture(canvas);
  // because our canvas is likely not a power of 2
  // in both dimensions set the filtering appropriately.
  texture.minFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
+  forceTextureInitialization(texture);

  ...
</pre>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/canvas-textured-labels-one-canvas.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/canvas-textured-labels-one-canvas.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Another issue is that the labels don't always face the camera. If you're using
labels as badges that's probably a good thing. If you're using labels to put
names over players in a 3D game maybe you want the labels to always face the camera.
We'll cover how to do that in <a href="billboards.html">an article on billboards</a>.</p>
<p>For labels in particular, <a href="align-html-elements-to-3d.html">another solution is to use HTML</a>.
The labels in this article are <em>inside the 3D world</em> which is good if you want them
to be hidden by other objects where as <a href="align-html-elements-to-3d.html">HTML labels</a> are always on top.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# cleanup.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Cleanup</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Cleanup">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Cleanup</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>Three.js apps often use lots of memory. A 3D model
might be 1 to 20 meg memory for all of its vertices.
A model might use many textures that even if they are
compressed into jpg files they have to be expanded
to their uncompressed form to use. Each 1024x1024
texture takes 4 to 6meg of memory.</p>
<p>Most three.js apps load resources at init time and
then use those resources forever until the page is
closed. But, what if you want to load and change resources
over time?</p>
<p>Unlike most JavaScript, three.js can not automatically
clean these resources up. The browser will clean them
up if you switch pages but otherwise it's up to you
to manage them. This is an issue of how WebGL is designed
and so three.js has no recourse but to pass on the
responsibility to free resources back to you.</p>
<p>You free three.js resource this by calling the <code class="notranslate" translate="no">dispose</code> function on
<a href="textures.html">textures</a>,
<a href="primitives.html">geometries</a>, and
<a href="materials.html">materials</a>.</p>
<p>You could do this manually. At the start you might create
some of these resources</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const boxGeometry = new THREE.BoxGeometry(...);
const boxTexture = textureLoader.load(...);
const boxMaterial = new THREE.MeshPhongMaterial({map: texture});
</pre>
<p>and then when you're done with them you'd free them</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">boxGeometry.dispose();
boxTexture.dispose();
boxMaterial.dispose();
</pre>
<p>As you use more and more resources that would get more and
more tedious.</p>
<p>To help remove some of the tedium let's make a class to track
the resources. We'll then ask that class to do the cleanup
for us.</p>
<p>Here's a first pass at such a class</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ResourceTracker {
  constructor() {
    this.resources = new Set();
  }
  track(resource) {
    if (resource.dispose) {
      this.resources.add(resource);
    }
    return resource;
  }
  untrack(resource) {
    this.resources.delete(resource);
  }
  dispose() {
    for (const resource of this.resources) {
      resource.dispose();
    }
    this.resources.clear();
  }
}
</pre>
<p>Let's use this class with the first example from <a href="textures.html">the article on textures</a>.
We can create an instance of this class</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const resTracker = new ResourceTracker();
</pre>
<p>and then just to make it easier to use let's create a bound function for the <code class="notranslate" translate="no">track</code> method</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const resTracker = new ResourceTracker();
+const track = resTracker.track.bind(resTracker);
</pre>
<p>Now to use it we just need to call <code class="notranslate" translate="no">track</code> with for each geometry, texture, and material
we create</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
-const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
+const geometry = track(new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth));

const cubes = [];  // an array we can use to rotate the cubes
const loader = new THREE.TextureLoader();

-const material = new THREE.MeshBasicMaterial({
-  map: loader.load('resources/images/wall.jpg'),
-});
+const material = track(new THREE.MeshBasicMaterial({
+  map: track(loader.load('resources/images/wall.jpg')),
+}));
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
cubes.push(cube);  // add to our list of cubes to rotate
</pre>
<p>And then to free them we'd want to remove the cubes from the scene
and then call <code class="notranslate" translate="no">resTracker.dispose</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">for (const cube of cubes) {
  scene.remove(cube);
}
cubes.length = 0;  // clears the cubes array
resTracker.dispose();
</pre>
<p>That would work but I find having to remove the cubes from the
scene kind of tedious. Let's add that functionality to the <code class="notranslate" translate="no">ResourceTracker</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ResourceTracker {
  constructor() {
    this.resources = new Set();
  }
  track(resource) {
-    if (resource.dispose) {
+    if (resource.dispose || resource instanceof THREE.Object3D) {
      this.resources.add(resource);
    }
    return resource;
  }
  untrack(resource) {
    this.resources.delete(resource);
  }
  dispose() {
    for (const resource of this.resources) {
-      resource.dispose();
+      if (resource instanceof THREE.Object3D) {
+        if (resource.parent) {
+          resource.parent.remove(resource);
+        }
+      }
+      if (resource.dispose) {
+        resource.dispose();
+      }
+    }
    this.resources.clear();
  }
}
</pre>
<p>And now we can track the cubes</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const material = track(new THREE.MeshBasicMaterial({
  map: track(loader.load('resources/images/wall.jpg')),
}));
const cube = track(new THREE.Mesh(geometry, material));
scene.add(cube);
cubes.push(cube);  // add to our list of cubes to rotate
</pre>
<p>We no longer need the code to remove the cubes from the scene.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-for (const cube of cubes) {
-  scene.remove(cube);
-}
cubes.length = 0;  // clears the cube array
resTracker.dispose();
</pre>
<p>Let's arrange this code so that we can re-add the cube,
texture, and material.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const scene = new THREE.Scene();
*const cubes = [];  // just an array we can use to rotate the cubes

+function addStuffToScene() {
  const resTracker = new ResourceTracker();
  const track = resTracker.track.bind(resTracker);

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = track(new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth));

  const loader = new THREE.TextureLoader();

  const material = track(new THREE.MeshBasicMaterial({
    map: track(loader.load('resources/images/wall.jpg')),
  }));
  const cube = track(new THREE.Mesh(geometry, material));
  scene.add(cube);
  cubes.push(cube);  // add to our list of cubes to rotate
+  return resTracker;
+}
</pre>
<p>And then let's write some code to add and remove things over time.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function waitSeconds(seconds = 0) {
  return new Promise(resolve =&gt; setTimeout(resolve, seconds * 1000));
}

async function process() {
  for (;;) {
    const resTracker = addStuffToScene();
    await wait(2);
    cubes.length = 0;  // remove the cubes
    resTracker.dispose();
    await wait(1);
  }
}
process();
</pre>
<p>This code will create the cube, texture and material, wait for 2 seconds, then dispose of them and wait for 1 second
and repeat.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/cleanup-simple.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/cleanup-simple.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>So that seems to work.</p>
<p>For a loaded file though it's a little more work. Most loaders only return an <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a>
as a root of the hierarchy of objects they load so we need to discover what all the resources
are.</p>
<p>Let's update our <code class="notranslate" translate="no">ResourceTracker</code> to try to do that.</p>
<p>First we'll check if the object is an <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> then track its geometry, material, and children</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ResourceTracker {
  constructor() {
    this.resources = new Set();
  }
  track(resource) {
    if (resource.dispose || resource instanceof THREE.Object3D) {
      this.resources.add(resource);
    }
+    if (resource instanceof THREE.Object3D) {
+      this.track(resource.geometry);
+      this.track(resource.material);
+      this.track(resource.children);
+    }
    return resource;
  }
  ...
}
</pre>
<p>Now, because any of <code class="notranslate" translate="no">resource.geometry</code>, <code class="notranslate" translate="no">resource.material</code>, and <code class="notranslate" translate="no">resource.children</code>
might be null or undefined we'll check at the top of <code class="notranslate" translate="no">track</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ResourceTracker {
  constructor() {
    this.resources = new Set();
  }
  track(resource) {
+    if (!resource) {
+      return resource;
+    }

    if (resource.dispose || resource instanceof THREE.Object3D) {
      this.resources.add(resource);
    }
    if (resource instanceof THREE.Object3D) {
      this.track(resource.geometry);
      this.track(resource.material);
      this.track(resource.children);
    }
    return resource;
  }
  ...
}
</pre>
<p>Also because <code class="notranslate" translate="no">resource.children</code> is an array and because <code class="notranslate" translate="no">resource.material</code> can be
an array let's check for arrays</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ResourceTracker {
  constructor() {
    this.resources = new Set();
  }
  track(resource) {
    if (!resource) {
      return resource;
    }

+    // handle children and when material is an array of materials.
+    if (Array.isArray(resource)) {
+      resource.forEach(resource =&gt; this.track(resource));
+      return resource;
+    }

    if (resource.dispose || resource instanceof THREE.Object3D) {
      this.resources.add(resource);
    }
    if (resource instanceof THREE.Object3D) {
      this.track(resource.geometry);
      this.track(resource.material);
      this.track(resource.children);
    }
    return resource;
  }
  ...
}
</pre>
<p>And finally we need to walk the properties and uniforms
of a material looking for textures.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ResourceTracker {
  constructor() {
    this.resources = new Set();
  }
  track(resource) {
    if (!resource) {
      return resource;
    }

*    // handle children and when material is an array of materials or
*    // uniform is array of textures
    if (Array.isArray(resource)) {
      resource.forEach(resource =&gt; this.track(resource));
      return resource;
    }

    if (resource.dispose || resource instanceof THREE.Object3D) {
      this.resources.add(resource);
    }
    if (resource instanceof THREE.Object3D) {
      this.track(resource.geometry);
      this.track(resource.material);
      this.track(resource.children);
-    }
+    } else if (resource instanceof THREE.Material) {
+      // We have to check if there are any textures on the material
+      for (const value of Object.values(resource)) {
+        if (value instanceof THREE.Texture) {
+          this.track(value);
+        }
+      }
+      // We also have to check if any uniforms reference textures or arrays of textures
+      if (resource.uniforms) {
+        for (const value of Object.values(resource.uniforms)) {
+          if (value) {
+            const uniformValue = value.value;
+            if (uniformValue instanceof THREE.Texture ||
+                Array.isArray(uniformValue)) {
+              this.track(uniformValue);
+            }
+          }
+        }
+      }
+    }
    return resource;
  }
  ...
}
</pre>
<p>And with that let's take an example from <a href="load-gltf.html">the article on loading gltf files</a>
and make it load and free files.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const gltfLoader = new GLTFLoader();
function loadGLTF(url) {
  return new Promise((resolve, reject) =&gt; {
    gltfLoader.load(url, resolve, undefined, reject);
  });
}

function waitSeconds(seconds = 0) {
  return new Promise(resolve =&gt; setTimeout(resolve, seconds * 1000));
}

const fileURLs = [
  'resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',
  'resources/models/3dbustchallange_submission/scene.gltf',
  'resources/models/mountain_landscape/scene.gltf',
  'resources/models/simple_house_scene/scene.gltf',
];

async function loadFiles() {
  for (;;) {
    for (const url of fileURLs) {
      const resMgr = new ResourceTracker();
      const track = resMgr.track.bind(resMgr);
      const gltf = await loadGLTF(url);
      const root = track(gltf.scene);
      scene.add(root);

      // compute the box that contains all the stuff
      // from root and below
      const box = new THREE.Box3().setFromObject(root);

      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // set the camera to frame the box
      frameArea(boxSize * 1.1, boxSize, boxCenter, camera);

      await waitSeconds(2);
      renderer.render(scene, camera);

      resMgr.dispose();

      await waitSeconds(1);

    }
  }
}
loadFiles();
</pre>
<p>and we get</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/cleanup-loaded-files.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/cleanup-loaded-files.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Some notes about the code.</p>
<p>If we wanted to load 2 or more files at once and free them at
anytime we would use one <code class="notranslate" translate="no">ResourceTracker</code> per file.</p>
<p>Above we are only tracking <code class="notranslate" translate="no">gltf.scene</code> right after loading.
Based on our current implementation of <code class="notranslate" translate="no">ResourceTracker</code> that
will track all the resources just loaded. If we added more
things to the scene we need to decide whether or not to track them.</p>
<p>For example let's say after we loaded a character we put a tool
in their hand by making the tool a child of their hand. As it is
that tool will not be freed. I'm guessing more often than not
this is what we want. </p>
<p>That brings up a point. Originally when I first wrote the <code class="notranslate" translate="no">ResourceTracker</code>
above I walked through everything inside the <code class="notranslate" translate="no">dispose</code> method instead of <code class="notranslate" translate="no">track</code>.
It was only later as I thought about the tool as a child of hand case above
that it became clear that tracking exactly what to free in <code class="notranslate" translate="no">track</code> was more
flexible and arguably more correct since we could then track what was loaded
from the file rather than just freeing the state of the scene graph later.</p>
<p>I honestly am not 100% happy with <code class="notranslate" translate="no">ResourceTracker</code>. Doing things this
way is not common in 3D engines. We shouldn't have to guess what
resources were loaded, we should know. It would be nice if three.js
changed so that all file loaders returned some standard object with
references to all the resources loaded. At least at the moment,
three.js doesn't give us any more info when loading a scene so this
solution seems to work.</p>
<p>I hope you find this example useful or at least a good reference for what is
required to free resources in three.js</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# custom-buffergeometry.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Custom BufferGeometry</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Custom BufferGeometry">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Custom BufferGeometry</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p><a href="/docs/#api/en/core/BufferGeometry"><code class="notranslate" translate="no">BufferGeometry</code></a> is three.js's way of representing all geometry. A <a href="/docs/#api/en/core/BufferGeometry"><code class="notranslate" translate="no">BufferGeometry</code></a>
essentially a collection <em>named</em> of <a href="/docs/#api/en/core/BufferAttribute"><code class="notranslate" translate="no">BufferAttribute</code></a>s.
Each <a href="/docs/#api/en/core/BufferAttribute"><code class="notranslate" translate="no">BufferAttribute</code></a> represents an array of one type of data: positions,
normals, colors, uv, etc... Together, the named <a href="/docs/#api/en/core/BufferAttribute"><code class="notranslate" translate="no">BufferAttribute</code></a>s represent
<em>parallel arrays</em> of all the data for each vertex.</p>
<div class="threejs_center"><img src="../resources/threejs-attributes.svg" style="width: 700px"></div>

<p>Above you can see we have 4 attributes: <code class="notranslate" translate="no">position</code>, <code class="notranslate" translate="no">normal</code>, <code class="notranslate" translate="no">color</code>, <code class="notranslate" translate="no">uv</code>.
They represent <em>parallel arrays</em> which means that the Nth set of data in each
attribute belongs to the same vertex. The vertex at index = 4 is highlighted
to show that the parallel data across all attributes defines one vertex.</p>
<p>This brings up a point, here's a diagram of a cube with one corner highlighted.</p>
<div class="threejs_center"><img src="../resources/cube-faces-vertex.svg" style="width: 500px"></div>

<p>Thinking about it that single corner needs a different normal for each face of the
cube. A normal is info about which direction something faces. In the diagram
the normals are presented by the arrows around the corner vertex showing that each
face that shares that vertex position needs a normal that points in a different direction.</p>
<p>That corner needs different UVs for each face as well. UVs are texture coordinates
that specify which part of a texture being drawn on a triangle corresponds to that
vertex position. You can see the green face needs that vertex to have a UV that corresponds
to the top right corner of the F texture, the blue face needs a UV that corresponds to the
top left corner of the F texture, and the red face needs a UV that corresponds to the bottom
left corner of the F texture.</p>
<p>A single <em>vertex</em> is the combination of all of its parts. If a vertex needs any
part to be different then it must be a different vertex.</p>
<p>As a simple example let's make a cube using <a href="/docs/#api/en/core/BufferGeometry"><code class="notranslate" translate="no">BufferGeometry</code></a>. A cube is interesting
because it appears to share vertices at the corners but really
does not. For our example we'll list out all the vertices with all their data
and then convert that data into parallel arrays and finally use those to make
<a href="/docs/#api/en/core/BufferAttribute"><code class="notranslate" translate="no">BufferAttribute</code></a>s and add them to a <a href="/docs/#api/en/core/BufferGeometry"><code class="notranslate" translate="no">BufferGeometry</code></a>.</p>
<p>We start with a list of all the data needed for the cube. Remember again
that if a vertex has any unique parts it has to be a separate vertex. As such
to make a cube requires 36 vertices. 2 triangles per face, 3 vertices per triangle,
6 faces = 36 vertices.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const vertices = [
  // front
  { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0, 0], },
  { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0], },
  { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1], },

  { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1], },
  { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0], },
  { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [1, 1], },
  // right
  { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 0], },
  { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0], },
  { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1], },

  { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1], },
  { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0], },
  { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 1], },
  // back
  { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0, 0], },
  { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0], },
  { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1], },

  { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1], },
  { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0], },
  { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [1, 1], },
  // left
  { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 0], },
  { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0], },
  { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1], },

  { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1], },
  { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0], },
  { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [1, 1], },
  // top
  { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0, 0], },
  { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0], },
  { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1], },

  { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1], },
  { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0], },
  { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [1, 1], },
  // bottom
  { pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0, 0], },
  { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0], },
  { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1], },

  { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1], },
  { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0], },
  { pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [1, 1], },
];
</pre>
<p>We can then translate all of that into 3 parallel arrays</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const positions = [];
const normals = [];
const uvs = [];
for (const vertex of vertices) {
  positions.push(...vertex.pos);
  normals.push(...vertex.norm);
  uvs.push(...vertex.uv);
}
</pre>
<p>Finally we can create a <a href="/docs/#api/en/core/BufferGeometry"><code class="notranslate" translate="no">BufferGeometry</code></a> and then a <a href="/docs/#api/en/core/BufferAttribute"><code class="notranslate" translate="no">BufferAttribute</code></a> for each array
and add it to the <a href="/docs/#api/en/core/BufferGeometry"><code class="notranslate" translate="no">BufferGeometry</code></a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">  const geometry = new THREE.BufferGeometry();
  const positionNumComponents = 3;
  const normalNumComponents = 3;
  const uvNumComponents = 2;
  geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
  geometry.setAttribute(
      'normal',
      new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
  geometry.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
</pre>
<p>Note that the names are significant. You must name your attributes the names
that match what three.js expects (unless you are creating a custom shader).
In this case <code class="notranslate" translate="no">position</code>, <code class="notranslate" translate="no">normal</code>, and <code class="notranslate" translate="no">uv</code>. If you want vertex colors then
name your attribute <code class="notranslate" translate="no">color</code>.</p>
<p>Above we created 3 JavaScript native arrays, <code class="notranslate" translate="no">positions</code>, <code class="notranslate" translate="no">normals</code> and <code class="notranslate" translate="no">uvs</code>.
We then convert those into
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray">TypedArrays</a>
of type <code class="notranslate" translate="no">Float32Array</code>. A <a href="/docs/#api/en/core/BufferAttribute"><code class="notranslate" translate="no">BufferAttribute</code></a> requires a TypedArray not a native
array. A <a href="/docs/#api/en/core/BufferAttribute"><code class="notranslate" translate="no">BufferAttribute</code></a> also requires you to tell it how many components there
are per vertex. For the positions and normals we have 3 components per vertex,
x, y, and z. For the UVs we have 2, u and v.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/custom-buffergeometry-cube.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/custom-buffergeometry-cube.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>That's a lot of data. A small thing we can do is use indices to reference
the vertices. Looking back at our cube data, each face is made from 2 triangles
with 3 vertices each, 6 vertices total, but 2 of those vertices are exactly the same;
The same position, the same normal, and the same uv.
So, we can remove the matching vertices and then
reference them by index. First we remove the matching vertices.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const vertices = [
  // front
  { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0, 0], }, // 0
  { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0], }, // 1
  { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1], }, // 2
-
-  { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1], },
-  { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0], },
  { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [1, 1], }, // 3
  // right
  { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 0], }, // 4
  { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0], }, // 5
-
-  { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1], },
-  { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0], },
  { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1], }, // 6
  { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 1], }, // 7
  // back
  { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0, 0], }, // 8
  { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0], }, // 9
-
-  { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1], },
-  { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0], },
  { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1], }, // 10
  { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [1, 1], }, // 11
  // left
  { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 0], }, // 12
  { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0], }, // 13
-
-  { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1], },
-  { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0], },
  { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1], }, // 14
  { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [1, 1], }, // 15
  // top
  { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0, 0], }, // 16
  { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0], }, // 17
-
-  { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1], },
-  { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0], },
  { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1], }, // 18
  { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [1, 1], }, // 19
  // bottom
  { pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0, 0], }, // 20
  { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0], }, // 21
-
-  { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1], },
-  { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0], },
  { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1], }, // 22
  { pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [1, 1], }, // 23
];
</pre>
<p>So now we have 24 unique vertices. Then we specify 36 indices
for the 36 vertices we need drawn to make 12 triangles by calling <a href="/docs/#api/en/core/BufferGeometry.setIndex"><code class="notranslate" translate="no">BufferGeometry.setIndex</code></a> with an array of indices.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, positionNumComponents));
geometry.setAttribute(
    'normal',
    new THREE.BufferAttribute(normals, normalNumComponents));
geometry.setAttribute(
    'uv',
    new THREE.BufferAttribute(uvs, uvNumComponents));

+geometry.setIndex([
+   0,  1,  2,   2,  1,  3,  // front
+   4,  5,  6,   6,  5,  7,  // right
+   8,  9, 10,  10,  9, 11,  // back
+  12, 13, 14,  14, 13, 15,  // left
+  16, 17, 18,  18, 17, 19,  // top
+  20, 21, 22,  22, 21, 23,  // bottom
+]);
</pre>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/custom-buffergeometry-cube-indexed.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/custom-buffergeometry-cube-indexed.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p><a href="/docs/#api/en/core/BufferGeometry"><code class="notranslate" translate="no">BufferGeometry</code></a> has a <a href="/docs/#api/en/core/BufferGeometry#computeVertexNormals"><code class="notranslate" translate="no">computeVertexNormals</code></a> method for computing normals if you
are not supplying them. Unfortunately,
since positions can not be shared if any other part of a vertex is different,
the results of calling <code class="notranslate" translate="no">computeVertexNormals</code> will generate seams if your
geometry is supposed to connect to itself like a sphere or a cylinder.</p>
<div class="spread">
  <div>
    <div data-diagram="bufferGeometryCylinder"></div>
  </div>
</div>

<p>For the cylinder above the normals were created using <code class="notranslate" translate="no">computeVertexNormals</code>.
If you look closely there is a seam on the cylinder. This is because there
is no way to share the vertices at the start and end of the cylinder since they
require different UVs so the function to compute them has no idea those are
the same vertices to smooth over them. Just a small thing to be aware of.
The solution is to supply your own normals.</p>
<p>We can also use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray">TypedArrays</a> from the start instead of native JavaScript arrays.
The disadvantage to TypedArrays is you must specify their size up front. Of
course that's not that large of a burden but with native arrays we can just
<code class="notranslate" translate="no">push</code> values onto them and look at what size they end up by checking their
<code class="notranslate" translate="no">length</code> at the end. With TypedArrays there is no push function so we need
to do our own bookkeeping when adding values to them.</p>
<p>In this example knowing the length up front is pretty easy since we're using
a big block of static data to start.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-const positions = [];
-const normals = [];
-const uvs = [];
+const numVertices = vertices.length;
+const positionNumComponents = 3;
+const normalNumComponents = 3;
+const uvNumComponents = 2;
+const positions = new Float32Array(numVertices * positionNumComponents);
+const normals = new Float32Array(numVertices * normalNumComponents);
+const uvs = new Float32Array(numVertices * uvNumComponents);
+let posNdx = 0;
+let nrmNdx = 0;
+let uvNdx = 0;
for (const vertex of vertices) {
-  positions.push(...vertex.pos);
-  normals.push(...vertex.norm);
-  uvs.push(...vertex.uv);
+  positions.set(vertex.pos, posNdx);
+  normals.set(vertex.norm, nrmNdx);
+  uvs.set(vertex.uv, uvNdx);
+  posNdx += positionNumComponents;
+  nrmNdx += normalNumComponents;
+  uvNdx += uvNumComponents;
}

geometry.setAttribute(
    'position',
-    new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
+    new THREE.BufferAttribute(positions, positionNumComponents));
geometry.setAttribute(
    'normal',
-    new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
+    new THREE.BufferAttribute(normals, normalNumComponents));
geometry.setAttribute(
    'uv',
-    new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
+    new THREE.BufferAttribute(uvs, uvNumComponents));

geometry.setIndex([
   0,  1,  2,   2,  1,  3,  // front
   4,  5,  6,   6,  5,  7,  // right
   8,  9, 10,  10,  9, 11,  // back
  12, 13, 14,  14, 13, 15,  // left
  16, 17, 18,  18, 17, 19,  // top
  20, 21, 22,  22, 21, 23,  // bottom
]);
</pre>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/custom-buffergeometry-cube-typedarrays.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/custom-buffergeometry-cube-typedarrays.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>A good reason to use typedarrays is if you want to dynamically update any
part of the vertices.</p>
<p>I couldn't think of a really good example of dynamically updating the vertices
so I decided to make a sphere and move each quad in and out from the center. Hopefully
it's a useful example.</p>
<p>Here's the code to generate positions and indices for a sphere. The code
is sharing vertices within a quad but it's not sharing vertices between
quads because we want to be able to move each quad separately.</p>
<p>Because I'm lazy I used a small hierarchy of 3 <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> objects to compute
sphere points. How this works is explained in <a href="optimize-lots-of-objects.html">the article on optimizing lots of objects</a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function makeSpherePositions(segmentsAround, segmentsDown) {
  const numVertices = segmentsAround * segmentsDown * 6;
  const numComponents = 3;
  const positions = new Float32Array(numVertices * numComponents);
  const indices = [];

  const longHelper = new THREE.Object3D();
  const latHelper = new THREE.Object3D();
  const pointHelper = new THREE.Object3D();
  longHelper.add(latHelper);
  latHelper.add(pointHelper);
  pointHelper.position.z = 1;
  const temp = new THREE.Vector3();

  function getPoint(lat, long) {
    latHelper.rotation.x = lat;
    longHelper.rotation.y = long;
    longHelper.updateMatrixWorld(true);
    return pointHelper.getWorldPosition(temp).toArray();
  }

  let posNdx = 0;
  let ndx = 0;
  for (let down = 0; down &lt; segmentsDown; ++down) {
    const v0 = down / segmentsDown;
    const v1 = (down + 1) / segmentsDown;
    const lat0 = (v0 - 0.5) * Math.PI;
    const lat1 = (v1 - 0.5) * Math.PI;

    for (let across = 0; across &lt; segmentsAround; ++across) {
      const u0 = across / segmentsAround;
      const u1 = (across + 1) / segmentsAround;
      const long0 = u0 * Math.PI * 2;
      const long1 = u1 * Math.PI * 2;

      positions.set(getPoint(lat0, long0), posNdx);  posNdx += numComponents;
      positions.set(getPoint(lat1, long0), posNdx);  posNdx += numComponents;
      positions.set(getPoint(lat0, long1), posNdx);  posNdx += numComponents;
      positions.set(getPoint(lat1, long1), posNdx);  posNdx += numComponents;

      indices.push(
        ndx, ndx + 1, ndx + 2,
        ndx + 2, ndx + 1, ndx + 3,
      );
      ndx += 4;
    }
  }
  return {positions, indices};
}
</pre>
<p>We can then call it like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const segmentsAround = 24;
const segmentsDown = 16;
const {positions, indices} = makeSpherePositions(segmentsAround, segmentsDown);
</pre>
<p>Because positions returned are unit sphere positions so they are exactly the same
values we need for normals so we can just duplicated them for the normals.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const normals = positions.slice();
</pre>
<p>And then we setup the attributes like before</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const geometry = new THREE.BufferGeometry();
const positionNumComponents = 3;
const normalNumComponents = 3;

+const positionAttribute = new THREE.BufferAttribute(positions, positionNumComponents);
+positionAttribute.setUsage(THREE.DynamicDrawUsage);
geometry.setAttribute(
    'position',
+    positionAttribute);
geometry.setAttribute(
    'normal',
    new THREE.BufferAttribute(normals, normalNumComponents));
geometry.setIndex(indices);
</pre>
<p>I've highlighted a few differences. We save a reference to the position attribute.
We also mark it as dynamic. This is a hint to THREE.js that we're going to be changing
the contents of the attribute often.</p>
<p>In our render loop we update the positions based off their normals every frame.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const temp = new THREE.Vector3();

...

for (let i = 0; i &lt; positions.length; i += 3) {
  const quad = (i / 12 | 0);
  const ringId = quad / segmentsAround | 0;
  const ringQuadId = quad % segmentsAround;
  const ringU = ringQuadId / segmentsAround;
  const angle = ringU * Math.PI * 2;
  temp.fromArray(normals, i);
  temp.multiplyScalar(THREE.MathUtils.lerp(1, 1.4, Math.sin(time + ringId + angle) * .5 + .5));
  temp.toArray(positions, i);
}
positionAttribute.needsUpdate = true;
</pre>
<p>And we set <code class="notranslate" translate="no">positionAttribute.needsUpdate</code> to tell THREE.js to use our changes.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/custom-buffergeometry-dynamic.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/custom-buffergeometry-dynamic.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>I hope these were useful examples of how to use <a href="/docs/#api/en/core/BufferGeometry"><code class="notranslate" translate="no">BufferGeometry</code></a> directly to
make your own geometry and how to dynamically update the contents of a
<a href="/docs/#api/en/core/BufferAttribute"><code class="notranslate" translate="no">BufferAttribute</code></a>.</p>
<!-- needed in English only to prevent warning from outdated translations -->
<p><a href="resources/threejs-geometry.svg"></a></p>
<p><canvas id="c"></canvas></p>
<script type="module" src="../resources/threejs-custom-buffergeometry.js"></script>


        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# debugging-glsl.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Debugging - GLSL</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Debugging - GLSL">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Debugging - GLSL</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This site so far does not teach GLSL just like it does not teach JavaScript.
Those are really large topics. If you want to learn GLSL consider checking out
<a href="https://webglfundamentals.org">these articles</a> as a starting place.</p>
<p>If you already know GLSL then here are a few tips for debugging.</p>
<p>When I'm making a new GLSL shader and nothing appears generally
the first thing I do is change the fragment shader to return a solid
color. For example at the very bottom of the shader I might put</p>
<pre class="prettyprint showlinemods notranslate lang-glsl" translate="no">void main() {

  ...

  gl_FragColor = vec4(1, 0, 0, 1);  // red
}
</pre>
<p>If I see the object I was trying to draw then I know the issue is
related to my fragment shader. It could be anything like bad textures,
uninitialized uniforms, uniforms with the wrong values but at least
I have a direction to look.</p>
<p>To test some of those I might start trying to draw some of the inputs.
For example if I'm using normals in the fragment shader then I might
add</p>
<pre class="prettyprint showlinemods notranslate lang-glsl" translate="no">gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1);
</pre>
<p>Normals go from -1 to +1 so by multiplying by 0.5 and adding 0.5 we get
values that go from 0.0 to 1.0 which makes them useful for colors.</p>
<p>Try this with some things you know work and you'll start getting an idea
of what normals <em>normally</em> look like. If your normals don't look normal
then you have some clue where to look. If you're manipulating normals
in the fragments shader you can use the same technique to draw the
result of that manipulation.</p>
<div class="threejs_center"><img src="../resources/images/standard-primitive-normals.jpg" style="width: 650px;"></div>

<p>Similarly if we're using textures there will be texture coordinates and we
can draw them with something like</p>
<pre class="prettyprint showlinemods notranslate lang-glsl" translate="no">gl_FragColor = vec4(fract(vUv), 0, 1);
</pre>
<p>The <code class="notranslate" translate="no">fract</code> is there in case we're using texture coordinates that go outside
the 0 to 1 range. This is common if <code class="notranslate" translate="no">texture.repeat</code> is set to something greater
than 1.</p>
<div class="threejs_center"><img src="../resources/images/standard-primitive-uvs.jpg" style="width: 650px;"></div>

<p>You can do similar things for all values in your fragment shader. Figure out
what their range is likely to be, add some code to set <code class="notranslate" translate="no">gl_FragColor</code> with
that range scaled to 0.0 to 1.0</p>
<p>To check textures try a <a href="/docs/#api/en/textures/CanvasTexture"><code class="notranslate" translate="no">CanvasTexture</code></a> or a <a href="/docs/#api/en/textures/DataTexture"><code class="notranslate" translate="no">DataTexture</code></a> that you
know works.</p>
<p>Conversely, if after setting <code class="notranslate" translate="no">gl_FragColor</code> to red I still see nothing
then I have a hint my issue might be in the direction of the things
related to the vertex shader. Some matrices might be wrong or my
attributes might have bad data or be setup incorrectly.</p>
<p>I'd first look at the matrices. I might put a breakpoint right after
my call to <code class="notranslate" translate="no">renderer.render(scene, camera)</code> and then start expanding
things in the inspector. Is the camera's world matrix and projection
matrix at least not full of <code class="notranslate" translate="no">NaN</code>s? Expanding the scene and looking
at its <code class="notranslate" translate="no">children</code> I'd check that the world matrices look reasonable (no <code class="notranslate" translate="no">NaN</code>s)
and last 4 values of each matrix look reasonable for my scene. If I
expect my scene to be 50x50x50 units and some matrix shows 552352623.123
clearly something is wrong there.</p>
<div class="threejs_center"><img src="../resources/images/inspect-matrices.gif"></div>

<p>Just like we did for the fragment shader we can also draw values from the
vertex shader by passing them to the fragment shader. Declare a varying
in both and pass the value you're not sure is correct. In fact if my
shader use using normals I'll change the fragment shader to display them
like is mentioned above and then just set <code class="notranslate" translate="no">vNormal</code> to the value I want
to display but scaled so the values go from 0.0 to 1.0. I then look at the
results and see if they fit my expectations.</p>
<p>Another good thing to do is use a simpler shader. Can you draw your data
with <a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a>? If you can then try it and make sure it shows
up as expected.</p>
<p>If not what's the simplest vertex shader that will let you visualize your
geometry? Usually it's as simple as</p>
<pre class="prettyprint showlinemods notranslate lang-glsl" translate="no">gl_Position = projection * modelView * vec4(position.xyz, 1);
</pre>
<p>If that works start adding in your changes a little at a time.</p>
<p>Yet another thing you can do is use the
<a href="https://chrome.google.com/webstore/detail/shader-editor/ggeaidddejpbakgafapihjbgdlbbbpob?hl=en">Shader Editor extension for Chrome</a>
or similar for other browsers. It's a great way to look at how other shaders
are working. It's also good as you can make some of the changes suggested above
live while the code is running.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# debugging-javascript.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Debugging JavaScript</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Debugging JavaScript">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Debugging JavaScript</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>Most of this article is not directly about THREE.js but is
rather about debugging JavaScript in general. It seemed important in
that many people just starting with THREE.js are also just
starting with JavaScript so I hope this can help them more easily
solve any issues they run into.</p>
<p>Debugging is a big topic and I probably can't begin to cover
everything there is to know but if you're new to JavaScript
then here's an attempt to give a few pointers. I strongly
suggest you take some time to learn them. They'll help you
enormously in your learning.</p>
<h2 id="learn-your-browser-s-developer-tools">Learn your Browser's Developer Tools</h2>
<p>All browsers have developer tools.
<a href="https://developers.google.com/web/tools/chrome-devtools/">Chrome</a>,
<a href="https://developer.mozilla.org/en-US/docs/Tools">Firefox</a>,
<a href="https://developer.apple.com/safari/tools/">Safari</a>,
<a href="https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide">Edge</a>.</p>
<p>In Chrome you can click the the <code class="notranslate" translate="no">⋮</code> icon, pick More Tools-&gt;Developer Tools
to get to the developer tools. A keyboard shortcut is also shown there.</p>
<div class="threejs_center"><img class="border" src="../resources/images/devtools-chrome.jpg" style="width: 789px;"></div>

<p>In Firefox you click the <code class="notranslate" translate="no">☰</code> icon, pick "Web Developer", then pick
"Toggle Tools"</p>
<div class="threejs_center"><img class="border" src="../resources/images/devtools-firefox.jpg" style="width: 786px;"></div>

<p>In Safari you first have to enable the Develop menu from the
Advanced Safari Preferences.</p>
<div class="threejs_center"><img class="border" src="../resources/images/devtools-enable-safari.jpg" style="width: 775px;"></div>

<p>Then in the Develop menu you can pick "Show/Connect Web Inspector".</p>
<div class="threejs_center"><img class="border" src="../resources/images/devtools-safari.jpg" style="width: 777px;"></div>

<p>With Chrome you can also <a href="https://developers.google.com/web/tools/chrome-devtools/remote-debugging/">use Chrome on your computer to debug webpages running on Chrome on your Android phone or tablet</a>.
Similarly with Safari you can
<a href="https://www.google.com/search?q=safari+remote+debugging+ios">use your computer to debug webpages running on Safari on iPhones and iPads</a>.</p>
<p>I'm most familiar with Chrome so this guide will be using Chrome
as an example when referring to tools but most browsers have similar
features so it should be easy to apply anything here to all browsers.</p>
<h2 id="turn-off-the-cache">Turn off the cache</h2>
<p>Browsers try to reuse data they've already downloaded. This is great
for users so if you visit a website a second time many of the files
used to display the site will not have be downloaded again.</p>
<p>On the other hand this can be bad for web development. You change
a file on your computer, reload the page, and you don't see the changes
because the browser uses the version it got last time.</p>
<p>One solution during web development is to turn off the cache. This
way the browser will always get the newest versions of your files.</p>
<p>First pick settings from the corner menu</p>
<div class="threejs_center"><img class="border" src="../resources/images/devtools-chrome-settings.jpg" style="width: 778px"></div>

<p>Then pick "Disable Cache (while DevTools is open)".</p>
<div class="threejs_center"><img class="border" src="../resources/images/devtools-chrome-disable-cache.jpg" style="width: 779px"></div>

<h2 id="use-the-javascript-console">Use the JavaScript console</h2>
<p>Inside all devtools is a <em>console</em>. It shows warnings and error messages.</p>
<p><strong> READ THE MESSAGES!! </strong></p>
<p>Typically there should be only 1 or 2 messages.</p>
<div class="threejs_center"><img class="border" src="../resources/images/devtools-no-errors.jpg" style="width: 779px"></div>

<p>If you see any others <strong>READ THEM</strong>. For example:</p>
<div class="threejs_center"><img class="border" src="../resources/images/devtools-errors.jpg" style="width: 779px"></div>

<p>I mis-spelled "three" as "threee"</p>
<p>You can also print your own info to the console with with <code class="notranslate" translate="no">console.log</code> as in</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">console.log(someObject.position.x, someObject.position.y, someObject.position.z);
</pre>
<p>Even cooler, if you log an object you can inspect it. For example if we log
the root scene object from <a href="load-gltf.html">the gLTF article</a></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">  {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf', (gltf) =&gt; {
      const root = gltf.scene;
      scene.add(root);
+      console.log(root);
</pre>
<p>Then we can expand that object in the JavaScript console</p>
<div class="threejs_center"><img class="border" src="../resources/images/devtools-console-object.gif"></div>

<p>You can also use <code class="notranslate" translate="no">console.error</code> which reports the message in red
in includes a stack trace.</p>
<h2 id="put-data-on-screen">Put data on screen</h2>
<p>Another obvious but often overlooked way is to add <code class="notranslate" translate="no">&lt;div&gt;</code> or <code class="notranslate" translate="no">&lt;pre&gt;</code> tags
and put data in them.</p>
<p>The most obvious way is to make some HTML elements</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;canvas id="c"&gt;&lt;/canvas&gt;
+&lt;div id="debug"&gt;
+  &lt;div&gt;x:&lt;span id="x"&gt;&lt;/span&gt;&lt;/div&gt;
+  &lt;div&gt;y:&lt;span id="y"&gt;&lt;/span&gt;&lt;/div&gt;
+  &lt;div&gt;z:&lt;span id="z"&gt;&lt;/span&gt;&lt;/div&gt;
+&lt;/div&gt;
</pre>
<p>Style them so they stay on top of the canvas. (assuming your canvas
fills the page)</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;style&gt;
#debug {
  position: absolute;
  left: 1em;
  top: 1em;
  padding: 1em;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-family: monospace;
}
&lt;/style&gt;
</pre>
<p>And then looking the elements up and setting their content.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// at init time
const xElem = document.querySelector('#x');
const yElem = document.querySelector('#y');
const zElem = document.querySelector('#z');

// at render or update time
xElem.textContent = someObject.position.x.toFixed(3);
yElem.textContent = someObject.position.y.toFixed(3);
zElem.textContent = someObject.position.z.toFixed(3);
</pre>
<p>This is more useful for real time values</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/debug-js-html-elements.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/debug-js-html-elements.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Another way to put data on the screen is to make a clearing logger.
I just made that term up but lots of games I've worked on have used this solution. The idea
is you have a buffer that displays messages for only one frame.
Any part of your code that wants to display data calls some function
to add data to that buffer every frame. This is much less work
than making an element per piece of data above.</p>
<p>For example let's change the HTML from above to just this</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;canvas id="c"&gt;&lt;/canvas&gt;
&lt;div id="debug"&gt;
  &lt;pre&gt;&lt;/pre&gt;
&lt;/div&gt;
</pre>
<p>And let's make simple class to manage this <em>clear back buffer</em>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ClearingLogger {
  constructor(elem) {
    this.elem = elem;
    this.lines = [];
  }
  log(...args) {
    this.lines.push([...args].join(' '));
  }
  render() {
    this.elem.textContent = this.lines.join('\n');
    this.lines = [];
  }
}
</pre>
<p>Then let's make a simple example that every time we click the mouse makes a mesh
that moves in a random direction for 2 seconds. We'll start with one of the
examples from the article on <a href="responsive.html">making things responsive</a></p>
<p>Here's the code that adds a new <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> every time we click the mouse</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const geometry = new THREE.SphereGeometry();
const material = new THREE.MeshBasicMaterial({color: 'red'});

const things = [];

function rand(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min;
}

function createThing() {
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  things.push({
    mesh,
    timer: 2,
    velocity: new THREE.Vector3(rand(-5, 5), rand(-5, 5), rand(-5, 5)),
  });
}

canvas.addEventListener('click', createThing);
</pre>
<p>And here's the code that moves the meshes we created, logs them,
and removes them when their timer has run out</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const logger = new ClearingLogger(document.querySelector('#debug pre'));

let then = 0;
function render(now) {
  now *= 0.001;  // convert to seconds
  const deltaTime = now - then;
  then = now;

  ...

  logger.log('fps:', (1 / deltaTime).toFixed(1));
  logger.log('num things:', things.length);
  for (let i = 0; i &lt; things.length;) {
    const thing = things[i];
    const mesh = thing.mesh;
    const pos = mesh.position;
    logger.log(
        'timer:', thing.timer.toFixed(3),
        'pos:', pos.x.toFixed(3), pos.y.toFixed(3), pos.z.toFixed(3));
    thing.timer -= deltaTime;
    if (thing.timer &lt;= 0) {
      // remove this thing. Note we don't advance `i`
      things.splice(i, 1);
      scene.remove(mesh);
    } else {
      mesh.position.addScaledVector(thing.velocity, deltaTime);
      ++i;
    }
  }

  renderer.render(scene, camera);
  logger.render();

  requestAnimationFrame(render);
}
</pre>
<p>Now click the mouse a bunch in the example below</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/debug-js-clearing-logger.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/debug-js-clearing-logger.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<h2 id="query-parameters">Query Parameters</h2>
<p>Another thing to remember is that webpages can have data passed
into them either via query parameters or the anchor, sometimes called
the search and the hash.</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">https://domain/path/?query#anchor
</pre><p>You can use this to make features optional or pass in parameters.</p>
<p>For example let's take the previous example and make it so
the debug stuff only shows up if we put <code class="notranslate" translate="no">?debug=true</code> in the URL.</p>
<p>First we need some code to parse the query string</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">/**
  * Returns the query parameters as a key/value object.
  * Example: If the query parameters are
  *
  *    abc=123&amp;def=456&amp;name=gman
  *
  * Then `getQuery()` will return an object like
  *
  *    {
  *      abc: '123',
  *      def: '456',
  *      name: 'gman',
  *    }
  */
function getQuery() {
  return Object.fromEntries(new URLSearchParams(window.location.search).entries());
}
</pre>
<p>Then we might make the debug element not show by default</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;canvas id="c"&gt;&lt;/canvas&gt;
+&lt;div id="debug" style="display: none;"&gt;
  &lt;pre&gt;&lt;/pre&gt;
&lt;/div&gt;
</pre>
<p>Then in the code we read the params and choose to un-hide the
debug info if and only if <code class="notranslate" translate="no">?debug=true</code> is passed in</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const query = getQuery();
const debug = query.debug === 'true';
const logger = debug
   ? new ClearingLogger(document.querySelector('#debug pre'))
   : new DummyLogger();
if (debug) {
  document.querySelector('#debug').style.display = '';
}
</pre>
<p>We also made a <code class="notranslate" translate="no">DummyLogger</code> that does nothing and chose to use it if <code class="notranslate" translate="no">?debug=true</code> has not been passed in.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class DummyLogger {
  log() {}
  render() {}
}
</pre>
<p>You can see if we use this url:</p>
<p><a target="_blank" href="../examples/debug-js-params.html">debug-js-params.html</a></p>
<p>there is no debug info but if we use this url:</p>
<p><a target="_blank" href="../examples/debug-js-params.html?debug=true">debug-js-params.html?debug=true</a></p>
<p>there is debug info.</p>
<p>Multiple parameters can be passed in by separating with '&amp;' as in <code class="notranslate" translate="no">somepage.html?someparam=somevalue&amp;someotherparam=someothervalue</code>.
Using parameters like this we can pass in all kinds of options. Maybe <code class="notranslate" translate="no">speed=0.01</code> to slow down our app for making it easier to understand something or <code class="notranslate" translate="no">showHelpers=true</code> for whether or not to add helpers
that show the lights, shadow, or camera frustum seen in other lessons.</p>
<h2 id="learn-to-use-the-debugger">Learn to use the Debugger</h2>
<p>Every browser has a debugger where you can pause your program
step through line by line and inspect all the variables.</p>
<p>Teaching you how to use a debugger is too big a topic for this
article but here's a few links</p>
<ul>
<li><a href="https://developers.google.com/web/tools/chrome-devtools/javascript/">Get Started with Debugging JavaScript in Chrome DevTools</a></li>
<li><a href="https://javascript.info/debugging-chrome">Debugging in Chrome</a></li>
<li><a href="https://hackernoon.com/tips-and-tricks-for-debugging-in-chrome-developer-tools-458ade27c7ab">Tips and Tricks for Debugging in Chrome Developer Tools</a></li>
</ul>
<h2 id="check-for-nan-in-the-debugger-or-elsewhere">Check for <code class="notranslate" translate="no">NaN</code> in the debugger or elsewhere</h2>
<p><code class="notranslate" translate="no">NaN</code> is short for Not A Number. It's what JavaScript will assign
as a value when you do something that doesn't make sense mathwise.</p>
<p>As a simple example</p>
<div class="threejs_center"><img class="border" src="../resources/images/nan-banana.png" style="width: 180px;"></div>

<p>Often when I'm making something and nothing appears on the screen
I'll check some values and if I see <code class="notranslate" translate="no">NaN</code> I will instantly have a
place to start looking.</p>
<p>As an example when I first started making the path for the
<a href="load-gltf.html">article about loading gLTF files</a> I made
a curve using the <a href="/docs/#api/en/extras/curves/SplineCurve"><code class="notranslate" translate="no">SplineCurve</code></a> class which makes a 2D curve.</p>
<p>I then used that curve to move the cars like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">curve.getPointAt(zeroToOnePointOnCurve, car.position);
</pre>
<p>Internally <code class="notranslate" translate="no">curve.getPointAt</code> calls the <code class="notranslate" translate="no">set</code> function
on the object passed as the second argument. In this case that
second argument is <code class="notranslate" translate="no">car.position</code> which is a <a href="/docs/#api/en/math/Vector3"><code class="notranslate" translate="no">Vector3</code></a>. <a href="/docs/#api/en/math/Vector3"><code class="notranslate" translate="no">Vector3</code></a>'s
<code class="notranslate" translate="no">set</code> function requires 3 arguments, x, y, and z but <a href="/docs/#api/en/extras/curves/SplineCurve"><code class="notranslate" translate="no">SplineCurve</code></a> is a 2D curve
and so it calls <code class="notranslate" translate="no">car.position.set</code> with just x and y.</p>
<p>The result is that <code class="notranslate" translate="no">car.position.set</code> sets x to x, y to y, and z to <code class="notranslate" translate="no">undefined</code>.</p>
<p>A quick glance in the debugger looking at the car's <code class="notranslate" translate="no">matrixWorld</code>
showed a bunch of <code class="notranslate" translate="no">NaN</code> values.</p>
<div class="threejs_center"><img class="border" src="../resources/images/debugging-nan.gif" style="width: 476px;"></div>

<p>Seeing the matrix had <code class="notranslate" translate="no">NaN</code>s in it suggested something like <code class="notranslate" translate="no">position</code>,
<code class="notranslate" translate="no">rotation</code>, <code class="notranslate" translate="no">scale</code> or some other function that affects that matrix had bad
data. Working backward from their it was easy to track down the issue.</p>
<p>In top of <code class="notranslate" translate="no">NaN</code> there's also <code class="notranslate" translate="no">Infinity</code> which is a similar sign there
is a math bug somewhere.</p>
<h2 id="look-in-the-code-">Look In the Code!</h2>
<p>THREE.js is Open Source. Don't be afraid to look inside the code!
You can look inside on <a href="https://github.com/mrdoob/three.js">github</a>.
You can also look inside by stepping into functions in the debugger.</p>
<h2 id="put-requestanimationframe-at-bottom-of-your-render-function-">Put <code class="notranslate" translate="no">requestAnimationFrame</code> at bottom of your render function.</h2>
<p>I see this pattern often</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render() {
   requestAnimationFrame(render);

   // -- do stuff --

   renderer.render(scene, camera);
}
requestAnimationFrame(render);
</pre>
<p>I'd suggest that putting the call to <code class="notranslate" translate="no">requestAnimationFrame</code> at
the bottom as in</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render() {
   // -- do stuff --

   renderer.render(scene, camera);

   requestAnimationFrame(render);
}
requestAnimationFrame(render);
</pre>
<p>The biggest reason is it means your code will stop if you have an error. Putting
<code class="notranslate" translate="no">requestAnimationFrame</code> at the top means your code will keep running even if you
have an error since you already requested another frame. IMO it's better to find
those errors than to ignore them. They could easily be the reason something is
not appearing as you expect it to but unless your code stops you might not even
notice.</p>
<h2 id="check-your-units-">Check your units!</h2>
<p>This basically means knowing for example when to use degrees vs
when to use radians. It's unfortunate that THREE.js does not
consistently use the same units everywhere. Off the top of my head
the camera's field of view is in degrees. All other angles are in
radians.</p>
<p>The other place to look out is your world unit size. Until
recently 3D apps could choose any unit size they wanted. One app might choose
1 unit = 1cm. Another might choose 1 unit = 1 foot. It's actually still
true that you can chose any units you want for certain applications.
That said, THREE.js assumes 1 unit = 1 meter. This is important for
things like physically based rendering which uses meters to compute
lighting effects. It's also important for AR and VR which need to
deal with real world units like where your phone is or where the VR
controllers are.</p>
<h2 id="making-a-minimal-complete-verifiable-example-for-stack-overflow">Making a <em>Minimal, Complete, Verifiable, Example</em> for Stack Overflow</h2>
<p>If you decide to ask a question about THREE.js it's almost always
required for you to provide an MCVE which stands for Minimal, Complete,
Verifiable, Example.</p>
<p>The <strong>Minimal</strong> part is important. Let's say you where having an issue with the
path movement in the last example of the <a href="load-gltf.html">loading a gLTF
article</a>. That example has many parts. Listing them out
it has</p>
<ol>
<li>A bunch of HTML</li>
<li>Some CSS</li>
<li>Lights</li>
<li>Shadows</li>
<li>lil-gui code to manipulate shadows</li>
<li>Code to load a .GLTF file</li>
<li>Code to resize the canvas.</li>
<li>Code to move the cars along paths</li>
</ol>
<p>That's pretty huge. If your question is only about the path following part you
can remove most of the HTML as you only need a <code class="notranslate" translate="no">&lt;canvas&gt;</code> and a <code class="notranslate" translate="no">&lt;script&gt;</code> tag
for THREE.js. You can remove the CSS and the resizing code. You can remove .GLTF
code because you only care about the path. You can remove the lights and the
shadows by using a <a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a>. You can certainly remove the lil-gui
code. The code makes a ground plane with a texture. It would be easier to use a
<a href="/docs/#api/en/helpers/GridHelper"><code class="notranslate" translate="no">GridHelper</code></a>. Finally if our question is about moving things on a path we could
just use cubes on the path instead of loaded car models.</p>
<p>Here's a more minimal example taking all the above into account. It
shrunk from 271 lines to 135. We might consider shrinking it even
more by simplifying our path. Maybe a path with 3 or 4 points would
work just as well as our path with 21 points.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/debugging-mcve.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/debugging-mcve.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>I kept the <code class="notranslate" translate="no">OrbitController</code> just because it's useful for others
to move the camera and figure out what's going on but depending
on your issue you might be able to remove that as well.</p>
<p>The best thing about making an MCVE is we'll often solve our own
problem. The process of removing everything that's not needed and
making the smallest example we can that reproduces the issue more
often than not leads us to our bug.</p>
<p>On top of that it's respectful of all the people's time who you are
asking to look at your code on Stack Overflow. By making the minimal
example you make it much easier for them to help you. You'll also
learn in the process.</p>
<p>Also important, when you go to Stack Overflow to post your question <strong>put your
code <a href="https://stackoverflow.blog/2014/09/16/introducing-runnable-javascript-css-and-html-code-snippets/">in a snippet</a>.</strong>
Of course you are welcome to use JSFiddle or Codepen or similar site to test out
your MCVE but once you actually get to posting your question on Stack Overflow
you're required to put the code to reproduce your issue <strong>in the question itself</strong>.
By making a snippet you satisfy that requirement.</p>
<p>Also note all the live examples on this site should run as snippets.
Just copy the HTML, CSS, and JavaScript parts to their respective
parts of the <a href="https://stackoverflow.blog/2014/09/16/introducing-runnable-javascript-css-and-html-code-snippets/">snippet editor</a>.
Just remember to try to remove the parts that are not relevant to
your issue and try to make your code the minimal amount needed.</p>
<p>Follow these suggestions and you're far more likely to get help
with your issue.</p>
<h2 id="use-a-meshbasicmaterial-">Use a <a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a></h2>
<p>Because the <a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a> uses no lights this is one way to
remove reasons something might not be showing up. If your objects
show up using <a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a> but not with whatever materials
you were using then you know the issue is likely with the materials
or the lights and not some other part of the code.</p>
<h2 id="check-your-near-and-far-settings-for-your-camera">Check your <code class="notranslate" translate="no">near</code> and <code class="notranslate" translate="no">far</code> settings for your camera</h2>
<p>A <a href="/docs/#api/en/cameras/PerspectiveCamera"><code class="notranslate" translate="no">PerspectiveCamera</code></a> has <code class="notranslate" translate="no">near</code> and <code class="notranslate" translate="no">far</code> settings which are covered in the
<a href="cameras.html">article on cameras</a>. Make sure they are set to fit the
space that contains your objects. Maybe even just <strong>temporarily</strong> set them to
something large like <code class="notranslate" translate="no">near</code> = 0.001 and <code class="notranslate" translate="no">far</code> = 1000000. You will likely run
into depth resolution issues but you'll at least be able to see your objects
provided they are in front of the camera.</p>
<h2 id="check-your-scene-is-in-front-of-the-camera">Check your scene is in front of the camera</h2>
<p>Sometimes things don't appear because they are not in front of the camera. If
your camera is not controllable try adding camera control like the
<code class="notranslate" translate="no">OrbitController</code> so you can look around and find your scene. Or, try framing
the scene using code which is covered in <a href="load-obj.html">this article</a>.
That code finds the size of part of the scene and then moves the camera and
adjusts the <code class="notranslate" translate="no">near</code> and <code class="notranslate" translate="no">far</code> settings to make it visible. You can then look in
the debugger or add some <code class="notranslate" translate="no">console.log</code> messages to print the size and center of
the scene.</p>
<h2 id="put-something-in-front-of-the-camera">Put something in front of the camera</h2>
<p>This is just another way of saying if all else fails start with
something that works and then slowly add stuff back in. If you get
a screen with nothing on it then try putting something directly in
front of the camera. Make a sphere or box, give it a simple material
like the <a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a> and make sure you can get that on the screen.
Then start adding things back a little at time and testing. Eventually
you'll either reproduce your bug or you'll find it on the way.</p>
<hr>
<p>These were a few tips for debugging JavaScript. Let's also go
over <a href="debugging-glsl.html">some tips for debugging GLSL</a>.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# fog.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Fog</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Fog">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Fog</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This article is part of a series of articles about three.js. The
first article is <a href="fundamentals.html">three.js fundamentals</a>. If
you haven't read that yet and you're new to three.js you might want to
consider starting there. If you haven't read about cameras you might
want to start with <a href="cameras.html">this article</a>.</p>
<p>Fog in a 3D engine is generally a way of fading to a specific color
based on the distance from the camera. In three.js you add fog by
creating <a href="/docs/#api/en/scenes/Fog"><code class="notranslate" translate="no">Fog</code></a> or <a href="/docs/#api/en/scenes/FogExp2"><code class="notranslate" translate="no">FogExp2</code></a> object and setting it on the scene's
<a href="/docs/#api/en/scenes/Scene#fog"><code class="notranslate" translate="no">fog</code></a> property.</p>
<p><a href="/docs/#api/en/scenes/Fog"><code class="notranslate" translate="no">Fog</code></a> lets you choose <code class="notranslate" translate="no">near</code> and <code class="notranslate" translate="no">far</code> settings which are distances
from the camera. Anything closer than <code class="notranslate" translate="no">near</code> is unaffected by fog.
Anything further than <code class="notranslate" translate="no">far</code> is completely the fog color. Parts between
<code class="notranslate" translate="no">near</code> and <code class="notranslate" translate="no">far</code> fade from their material color to the fog color.</p>
<p>There's also <a href="/docs/#api/en/scenes/FogExp2"><code class="notranslate" translate="no">FogExp2</code></a> which grows exponentially with distance from the camera.</p>
<p>To use either type of fog you create one and and assign it to the scene as in</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const scene = new THREE.Scene();
{
  const color = 0xFFFFFF;  // white
  const near = 10;
  const far = 100;
  scene.fog = new THREE.Fog(color, near, far);
}
</pre>
<p>or for <a href="/docs/#api/en/scenes/FogExp2"><code class="notranslate" translate="no">FogExp2</code></a> it would be</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const scene = new THREE.Scene();
{
  const color = 0xFFFFFF;
  const density = 0.1;
  scene.fog = new THREE.FogExp2(color, density);
}
</pre>
<p><a href="/docs/#api/en/scenes/FogExp2"><code class="notranslate" translate="no">FogExp2</code></a> is closer to reality but <a href="/docs/#api/en/scenes/Fog"><code class="notranslate" translate="no">Fog</code></a> is used
more commonly since it lets you choose a place to apply
the fog so you can decide to show a clear scene
up to a certain distance and then fade out to some color
past that distance.</p>
<div class="spread">
  <div>
    <div data-diagram="fog" style="height: 300px;"></div>
    <div class="code">THREE.Fog</div>
  </div>
  <div>
    <div data-diagram="fogExp2" style="height: 300px;"></div>
    <div class="code">THREE.FogExp2</div>
  </div>
</div>

<p>It's important to note that the fog is applied to <em>things that are rendered</em>.
It is part of the calculation of each pixel of the color of the object.
What that means is if you want your scene to fade to a certain color you
need to set the fog <strong>and</strong> the background color to the same color.
The background color is set using the
<a href="/docs/#api/en/scenes/Scene#background"><code class="notranslate" translate="no">scene.background</code></a>
property. To pick a background color you attach a <a href="/docs/#api/en/math/Color"><code class="notranslate" translate="no">THREE.Color</code></a> to it. For example</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">scene.background = new THREE.Color('#F00');  // red
</pre>
<div class="spread">
  <div>
    <div data-diagram="fogBlueBackgroundRed" style="height: 300px;" class="border"></div>
    <div class="code">fog blue, background red</div>
  </div>
  <div>
    <div data-diagram="fogBlueBackgroundBlue" style="height: 300px;" class="border"></div>
    <div class="code">fog blue, background blue</div>
  </div>
</div>

<p>Here is one of our previous examples with fog added. The only addition
is right after setting up the scene we add the fog and set the scene's
background color</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const scene = new THREE.Scene();

+{
+  const near = 1;
+  const far = 2;
+  const color = 'lightblue';
+  scene.fog = new THREE.Fog(color, near, far);
+  scene.background = new THREE.Color(color);
+}
</pre>
<p>In the example below the camera's <code class="notranslate" translate="no">near</code> is 0.1 and its <code class="notranslate" translate="no">far</code> is 5.
The camera is at <code class="notranslate" translate="no">z = 2</code>. The cubes are 1 unit large and at Z = 0.
This means with a fog setting of <code class="notranslate" translate="no">near = 1</code> and <code class="notranslate" translate="no">far = 2</code> the cubes
will fade out right around their center.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/fog.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/fog.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Let's add an interface so we can adjust the fog. Again we'll use
<a href="https://github.com/georgealways/lil-gui">lil-gui</a>. lil-gui takes
an object and a property and automagically makes an interface
for that type of property. We could just simply let it manipulate
the fog's <code class="notranslate" translate="no">near</code> and <code class="notranslate" translate="no">far</code> properties but it's invalid to have
<code class="notranslate" translate="no">near</code> be greater than <code class="notranslate" translate="no">far</code> so let's make a helper so lil-gui
can manipulate a <code class="notranslate" translate="no">near</code> and <code class="notranslate" translate="no">far</code> property but we'll make sure <code class="notranslate" translate="no">near</code>
is less than or equal to <code class="notranslate" translate="no">far</code> and <code class="notranslate" translate="no">far</code> is greater than or equal <code class="notranslate" translate="no">near</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// We use this class to pass to lil-gui
// so when it manipulates near or far
// near is never &gt; far and far is never &lt; near
class FogGUIHelper {
  constructor(fog) {
    this.fog = fog;
  }
  get near() {
    return this.fog.near;
  }
  set near(v) {
    this.fog.near = v;
    this.fog.far = Math.max(this.fog.far, v);
  }
  get far() {
    return this.fog.far;
  }
  set far(v) {
    this.fog.far = v;
    this.fog.near = Math.min(this.fog.near, v);
  }
}
</pre>
<p>We can then add it like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const near = 1;
  const far = 2;
  const color = 'lightblue';
  scene.fog = new THREE.Fog(color, near, far);
  scene.background = new THREE.Color(color);
+
+  const fogGUIHelper = new FogGUIHelper(scene.fog);
+  gui.add(fogGUIHelper, 'near', near, far).listen();
+  gui.add(fogGUIHelper, 'far', near, far).listen();
}
</pre>
<p>The <code class="notranslate" translate="no">near</code> and <code class="notranslate" translate="no">far</code> parameters set the minimum and maximum values
for adjusting the fog. They are set when we setup the camera.</p>
<p>The <code class="notranslate" translate="no">.listen()</code> at the end of the last 2 lines tells lil-gui to <em>listen</em>
for changes. That way when we change <code class="notranslate" translate="no">near</code> because of an edit to <code class="notranslate" translate="no">far</code>
or we change <code class="notranslate" translate="no">far</code> in response to an edit to <code class="notranslate" translate="no">near</code> lil-gui will update
the other property's UI for us.</p>
<p>It might also be nice to be able to change the fog color but like was
mentioned above we need to keep both the fog color and the background
color in sync. So, let's add another <em>virtual</em> property to our helper
that will set both colors when lil-gui manipulates it.</p>
<p>lil-gui can manipulate colors in 4 ways, as a CSS 6 digit hex string (eg: <code class="notranslate" translate="no">#112233</code>). As an hue, saturation, value, object (eg: <code class="notranslate" translate="no">{h: 60, s: 1, v: }</code>).
As an RGB array (eg: <code class="notranslate" translate="no">[255, 128, 64]</code>). Or, as an RGBA array (eg: <code class="notranslate" translate="no">[127, 200, 75, 0.3]</code>).</p>
<p>It's easiest for our purpose to use the hex string version since that way
lil-gui is only manipulating a single value. Fortunately <a href="/docs/#api/en/math/Color"><code class="notranslate" translate="no">THREE.Color</code></a>
as a <a href="/docs/#api/en/math/Color#getHexString"><code class="notranslate" translate="no">getHexString</code></a> method
we get use to easily get such a string, we just have to prepend a '#' to the front.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// We use this class to pass to lil-gui
// so when it manipulates near or far
// near is never &gt; far and far is never &lt; near
+// Also when lil-gui manipulates color we'll
+// update both the fog and background colors.
class FogGUIHelper {
*  constructor(fog, backgroundColor) {
    this.fog = fog;
+    this.backgroundColor = backgroundColor;
  }
  get near() {
    return this.fog.near;
  }
  set near(v) {
    this.fog.near = v;
    this.fog.far = Math.max(this.fog.far, v);
  }
  get far() {
    return this.fog.far;
  }
  set far(v) {
    this.fog.far = v;
    this.fog.near = Math.min(this.fog.near, v);
  }
+  get color() {
+    return `#${this.fog.color.getHexString()}`;
+  }
+  set color(hexString) {
+    this.fog.color.set(hexString);
+    this.backgroundColor.set(hexString);
+  }
}
</pre>
<p>We then call <code class="notranslate" translate="no">gui.addColor</code> to add a color UI for our helper's virtual property.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const near = 1;
  const far = 2;
  const color = 'lightblue';
  scene.fog = new THREE.Fog(color, near, far);
  scene.background = new THREE.Color(color);

*  const fogGUIHelper = new FogGUIHelper(scene.fog, scene.background);
  gui.add(fogGUIHelper, 'near', near, far).listen();
  gui.add(fogGUIHelper, 'far', near, far).listen();
+  gui.addColor(fogGUIHelper, 'color');
}
</pre>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/fog-gui.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/fog-gui.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>You can see setting <code class="notranslate" translate="no">near</code> to like 1.9 and <code class="notranslate" translate="no">far</code> to 2.0 gives
a very sharp transition between un-fogged and completely fogged.
where as <code class="notranslate" translate="no">near</code> = 1.1 and <code class="notranslate" translate="no">far</code> = 2.9 should just about be
the smoothest given our cubes are spinning 2 units away from the camera.</p>
<p>One last thing, there is a boolean <a href="/docs/#api/en/materials/Material#fog"><code class="notranslate" translate="no">fog</code></a>
property on a material for whether or not objects rendered
with that material are affected by fog. It defaults to <code class="notranslate" translate="no">true</code>
for most materials. As an example of why you might want
to turn the fog off, imagine you're making a 3D vehicle
simulator with a view from the driver's seat or cockpit.
You probably want the fog off for everything inside the vehicle when
viewing from inside the vehicle.</p>
<p>A better example might be a house
and thick fog outside house. Let's say the fog is set to start
2 meters away (near = 2) and completely fogged out at 4 meters (far = 4).
Rooms are longer than 2 meters and the house is probably longer
than 4 meters so you need to set the materials for the inside
of the house to not apply fog otherwise when standing inside the
house looking outside the wall at the far end of the room will look
like it's in the fog.</p>
<div class="spread">
  <div>
    <div data-diagram="fogHouseAll" style="height: 300px;" class="border"></div>
    <div class="code">fog: true, all</div>
  </div>
</div>

<p>Notice the walls and ceiling at the far end of the room are getting fog applied.
By turning fog off on the materials for the house we can fix that issue.</p>
<div class="spread">
  <div>
    <div data-diagram="fogHouseInsideNoFog" style="height: 300px;" class="border"></div>
    <div class="code">fog: true, only outside materials</div>
  </div>
</div>

<p><canvas id="c"></canvas></p>
<script type="module" src="../resources/threejs-fog.js"></script>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# fundamentals.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Fundamentals</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Fundamentals">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Fundamentals</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This is the first article in a series of articles about three.js.
<a href="https://threejs.org">Three.js</a> is a 3D library that tries to make
it as easy as possible to get 3D content on a webpage.</p>
<p>Three.js is often confused with WebGL since more often than
not, but not always, three.js uses WebGL to draw 3D.
<a href="https://webglfundamentals.org">WebGL is a very low-level system that only draws points, lines, and triangles</a>.
To do anything useful with WebGL generally requires quite a bit of
code and that is where three.js comes in. It handles stuff
like scenes, lights, shadows, materials, textures, 3d math, all things that you'd
have to write yourself if you were to use WebGL directly.</p>
<p>These tutorials assume you already know JavaScript and, for the
most part they will use ES6 style. <a href="prerequisites.html">See here for a
terse list of things you're expected to already know</a>.
Most browsers that support three.js are auto-updated so most users should
be able to run this code. If you'd like to make this code run
on really old browsers look into a transpiler like <a href="https://babeljs.io">Babel</a>.
Of course users running really old browsers probably have machines
that can't run three.js.</p>
<p>When learning most programming languages the first thing people
do is make the computer print <code class="notranslate" translate="no">"Hello World!"</code>. For 3D one
of the most common first things to do is to make a 3D cube.
So let's start with "Hello Cube!"</p>
<p>Before we get started let's try to give you an idea of the structure
of a three.js app. A three.js app requires you to create a bunch of
objects and connect them together. Here's a diagram that represents
a small three.js app</p>
<div class="threejs_center"><img src="../resources/images/threejs-structure.svg" style="width: 768px;"></div>

<p>Things to notice about the diagram above.</p>
<ul>
<li><p>There is a <a href="/docs/#api/en/constants/Renderer"><code class="notranslate" translate="no">Renderer</code></a>. This is arguably the main object of three.js. You pass a
<a href="/docs/#api/en/scenes/Scene"><code class="notranslate" translate="no">Scene</code></a> and a <a href="/docs/#api/en/cameras/Camera"><code class="notranslate" translate="no">Camera</code></a> to a <a href="/docs/#api/en/constants/Renderer"><code class="notranslate" translate="no">Renderer</code></a> and it renders (draws) the portion of
the 3D scene that is inside the <em>frustum</em> of the camera as a 2D image to a
canvas.</p>
</li>
<li><p>There is a <a href="scenegraph.html">scenegraph</a> which is a tree like
structure, consisting of various objects like a <a href="/docs/#api/en/scenes/Scene"><code class="notranslate" translate="no">Scene</code></a> object, multiple
<a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> objects, <a href="/docs/#api/en/lights/Light"><code class="notranslate" translate="no">Light</code></a> objects, <a href="/docs/#api/en/objects/Group"><code class="notranslate" translate="no">Group</code></a>, <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a>, and <a href="/docs/#api/en/cameras/Camera"><code class="notranslate" translate="no">Camera</code></a> objects. A
<a href="/docs/#api/en/scenes/Scene"><code class="notranslate" translate="no">Scene</code></a> object defines the root of the scenegraph and contains properties like
the background color and fog. These objects define a hierarchical parent/child
tree like structure and represent where objects appear and how they are
oriented. Children are positioned and oriented relative to their parent. For
example the wheels on a car might be children of the car so that moving and
orienting the car's object automatically moves the wheels. You can read more
about this in <a href="scenegraph.html">the article on scenegraphs</a>.</p>
<p>Note in the diagram <a href="/docs/#api/en/cameras/Camera"><code class="notranslate" translate="no">Camera</code></a> is half in half out of the scenegraph. This is to
represent that in three.js, unlike the other objects, a <a href="/docs/#api/en/cameras/Camera"><code class="notranslate" translate="no">Camera</code></a> does not have
to be in the scenegraph to function. Just like other objects, a <a href="/docs/#api/en/cameras/Camera"><code class="notranslate" translate="no">Camera</code></a>, as a
child of some other object, will move and orient relative to its parent object.
There is an example of putting multiple <a href="/docs/#api/en/cameras/Camera"><code class="notranslate" translate="no">Camera</code></a> objects in a scenegraph at
the end of <a href="scenegraph.html">the article on scenegraphs</a>.</p>
</li>
<li><p><a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> objects represent drawing a specific <code class="notranslate" translate="no">Geometry</code> with a specific
 <a href="/docs/#api/en/materials/Material"><code class="notranslate" translate="no">Material</code></a>. Both <a href="/docs/#api/en/materials/Material"><code class="notranslate" translate="no">Material</code></a> objects and <code class="notranslate" translate="no">Geometry</code> objects can be used by
 multiple <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> objects. For example to draw two blue cubes in different
 locations we could need two <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> objects to represent the position and
 orientation of each cube. We would only need one <code class="notranslate" translate="no">Geometry</code> to hold the vertex
 data for a cube and we would only need one <a href="/docs/#api/en/materials/Material"><code class="notranslate" translate="no">Material</code></a> to specify the color
 blue. Both <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> objects could reference the same <code class="notranslate" translate="no">Geometry</code> object and the
 same <a href="/docs/#api/en/materials/Material"><code class="notranslate" translate="no">Material</code></a> object.</p>
</li>
<li><p><code class="notranslate" translate="no">Geometry</code> objects represent the vertex data of some piece of geometry like
 a sphere, cube, plane, dog, cat, human, tree, building, etc...
 Three.js provides many kinds of built in
 <a href="primitives.html">geometry primitives</a>. You can also
 <a href="custom-buffergeometry.html">create custom geometry</a> as well as
 <a href="load-obj.html">load geometry from files</a>.</p>
</li>
<li><p><a href="/docs/#api/en/materials/Material"><code class="notranslate" translate="no">Material</code></a> objects represent
<a href="materials.html">the surface properties used to draw geometry</a>
including things like the color to use and how shiny it is. A <a href="/docs/#api/en/materials/Material"><code class="notranslate" translate="no">Material</code></a> can also
reference one or more <a href="/docs/#api/en/textures/Texture"><code class="notranslate" translate="no">Texture</code></a> objects which can be used, for example,
to wrap an image onto the surface of a geometry.</p>
</li>
<li><p><a href="/docs/#api/en/textures/Texture"><code class="notranslate" translate="no">Texture</code></a> objects generally represent images either <a href="textures.html">loaded from image files</a>,
<a href="canvas-textures.html">generated from a canvas</a> or <a href="rendertargets.html">rendered from another scene</a>.</p>
</li>
<li><p><a href="/docs/#api/en/lights/Light"><code class="notranslate" translate="no">Light</code></a> objects represent <a href="lights.html">different kinds of lights</a>.</p>
</li>
</ul>
<p>Given all of that we're going to make the smallest <em>"Hello Cube"</em> setup
that looks like this</p>
<div class="threejs_center"><img src="../resources/images/threejs-1cube-no-light-scene.svg" style="width: 500px;"></div>

<p>First let's load three.js</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;script type="module"&gt;
import * as THREE from 'three';
&lt;/script&gt;
</pre>
<p>It's important you put <code class="notranslate" translate="no">type="module"</code> in the script tag. This enables
us to use the <code class="notranslate" translate="no">import</code> keyword to load three.js. As of r147, this is the
only way to load three.js properly. Modules have the advantage that they can easily import other modules
they need. That saves us from having to manually load extra scripts
they are dependent on.</p>
<p>Next we need is a <code class="notranslate" translate="no">&lt;canvas&gt;</code> tag so...</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;body&gt;
  &lt;canvas id="c"&gt;&lt;/canvas&gt;
&lt;/body&gt;
</pre>
<p>We will ask three.js to draw into that canvas so we need to look it up.</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;script type="module"&gt;
import * as THREE from 'three';

+function main() {
+  const canvas = document.querySelector('#c');
+  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
+  ...
&lt;/script&gt;
</pre>
<p>After we look up the canvas we create a <a href="/docs/#api/en/renderers/WebGLRenderer"><code class="notranslate" translate="no">WebGLRenderer</code></a>. The renderer
is the thing responsible for actually taking all the data you provide
and rendering it to the canvas.</p>
<p>Note there are some esoteric details here. If you don't pass a canvas
into three.js it will create one for you but then you have to add it
to your document. Where to add it may change depending on your use case
and you'll have to change your code so I find that passing a canvas
to three.js feels a little more flexible. I can put the canvas anywhere
and the code will find it whereas if I had code to insert the canvas
into to the document I'd likely have to change that code if my use case
changed.</p>
<p>Next up we need a camera. We'll create a <a href="/docs/#api/en/cameras/PerspectiveCamera"><code class="notranslate" translate="no">PerspectiveCamera</code></a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
</pre>
<p><code class="notranslate" translate="no">fov</code> is short for <code class="notranslate" translate="no">field of view</code>. In this case 75 degrees in the vertical
dimension. Note that most angles in three.js are in radians but for some
reason the perspective camera takes degrees.</p>
<p><code class="notranslate" translate="no">aspect</code> is the display aspect of the canvas. We'll go over the details
<a href="responsive.html">in another article</a> but by default a canvas is
 300x150 pixels which makes the aspect 300/150 or 2.</p>
<p><code class="notranslate" translate="no">near</code> and <code class="notranslate" translate="no">far</code> represent the space in front of the camera
that will be rendered. Anything before that range or after that range
will be clipped (not drawn).</p>
<p>Those four settings define a <em>"frustum"</em>. A <em>frustum</em> is the name of
a 3d shape that is like a pyramid with the tip sliced off. In other
words think of the word "frustum" as another 3D shape like sphere,
cube, prism, frustum.</p>
<p><img src="../resources/frustum-3d.svg" width="500" class="threejs_center"></p>
<p>The height of the near and far planes are determined by the field of view.
The width of both planes is determined by the field of view and the aspect.</p>
<p>Anything inside the defined frustum will be drawn. Anything outside
will not.</p>
<p>The camera defaults to looking down the -Z axis with +Y up. We'll put our cube
at the origin so we need to move the camera back a little from the origin
in order to see anything.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">camera.position.z = 2;
</pre>
<p>Here's what we're aiming for.</p>
<p><img src="../resources/scene-down.svg" width="500" class="threejs_center"></p>
<p>In the diagram above we can see our camera is at <code class="notranslate" translate="no">z = 2</code>. It's looking
down the -Z axis. Our frustum starts 0.1 units from the front of the camera
and goes to 5 units in front of the camera. Because in this diagram we are looking down,
the field of view is affected by the aspect. Our canvas is twice as wide
as it is tall so across the canvas the field of view will be much wider than
our specified 75 degrees which is the vertical field of view.</p>
<p>Next we make a <a href="/docs/#api/en/scenes/Scene"><code class="notranslate" translate="no">Scene</code></a>. A <a href="/docs/#api/en/scenes/Scene"><code class="notranslate" translate="no">Scene</code></a> in three.js is the root of a form of scene graph.
Anything you want three.js to draw needs to be added to the scene. We'll
cover more details of <a href="scenegraph.html">how scenes work in a future article</a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const scene = new THREE.Scene();
</pre>
<p>Next up we create a <a href="/docs/#api/en/geometries/BoxGeometry"><code class="notranslate" translate="no">BoxGeometry</code></a> which contains the data for a box.
Almost anything we want to display in Three.js needs geometry which defines
the vertices that make up our 3D object.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
</pre>
<p>We then create a basic material and set its color. Colors can
be specified using standard CSS style 6 digit hex color values.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const material = new THREE.MeshBasicMaterial({color: 0x44aa88});
</pre>
<p>We then create a <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a>. A <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> in three.js represents the combination
of three things</p>
<ol>
<li>A <code class="notranslate" translate="no">Geometry</code> (the shape of the object)</li>
<li>A <a href="/docs/#api/en/materials/Material"><code class="notranslate" translate="no">Material</code></a> (how to draw the object, shiny or flat, what color, what texture(s) to apply. Etc.)</li>
<li>The position, orientation, and scale of that object in the scene relative to its parent. In the code below that parent is the scene.</li>
</ol>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const cube = new THREE.Mesh(geometry, material);
</pre>
<p>And finally we add that mesh to the scene</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">scene.add(cube);
</pre>
<p>We can then render the scene by calling the renderer's render function
and passing it the scene and the camera</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">renderer.render(scene, camera);
</pre>
<p>Here's a working example</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/fundamentals.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/fundamentals.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>It's kind of hard to tell that is a 3D cube since we're viewing
it directly down the -Z axis and the cube itself is axis aligned
so we're only seeing a single face.</p>
<p>Let's animate it spinning and hopefully that will make
it clear it's being drawn in 3D. To animate it we'll render inside a render loop using
<a href="https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame"><code class="notranslate" translate="no">requestAnimationFrame</code></a>.</p>
<p>Here's our loop</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {
  time *= 0.001;  // convert time to seconds

  cube.rotation.x = time;
  cube.rotation.y = time;

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
</pre>
<p><code class="notranslate" translate="no">requestAnimationFrame</code> is a request to the browser that you want to animate something.
You pass it a function to be called. In our case that function is <code class="notranslate" translate="no">render</code>. The browser
will call your function and if you update anything related to the display of the
page the browser will re-render the page. In our case we are calling three's
<code class="notranslate" translate="no">renderer.render</code> function which will draw our scene.</p>
<p><code class="notranslate" translate="no">requestAnimationFrame</code> passes the time since the page loaded to
our function. That time is passed in milliseconds. I find it's much
easier to work with seconds so here we're converting that to seconds.</p>
<p>We then set the cube's X and Y rotation to the current time. These rotations
are in <a href="https://en.wikipedia.org/wiki/Radian">radians</a>. There are 2 pi radians
in a circle so our cube should turn around once on each axis in about 6.28
seconds.</p>
<p>We then render the scene and request another animation frame to continue
our loop.</p>
<p>Outside the loop we call <code class="notranslate" translate="no">requestAnimationFrame</code> one time to start the loop.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/fundamentals-with-animation.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/fundamentals-with-animation.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>It's a little better but it's still hard to see the 3d. What would help is to
add some lighting so let's add a light. There are many kinds of lights in
three.js which we'll go over in <a href="lights.html">a future article</a>. For now let's create a directional light.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const color = 0xFFFFFF;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);
</pre>
<p>Directional lights have a position and a target. Both default to 0, 0, 0. In our
case we're setting the light's position to -1, 2, 4 so it's slightly on the left,
above, and behind our camera. The target is still 0, 0, 0 so it will shine
toward the origin.</p>
<p>We also need to change the material. The <a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a> is not affected by
lights. Let's change it to a <a href="/docs/#api/en/materials/MeshPhongMaterial"><code class="notranslate" translate="no">MeshPhongMaterial</code></a> which is affected by lights.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-const material = new THREE.MeshBasicMaterial({color: 0x44aa88});  // greenish blue
+const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue
</pre>
<p>Here is our new program structure</p>
<div class="threejs_center"><img src="../resources/images/threejs-1cube-with-directionallight.svg" style="width: 500px;"></div>

<p>And here it is working.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/fundamentals-with-light.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/fundamentals-with-light.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>It should now be pretty clearly 3D.</p>
<p>Just for the fun of it let's add 2 more cubes.</p>
<p>We'll use the same geometry for each cube but make a different
material so each cube can be a different color.</p>
<p>First we'll make a function that creates a new material
with the specified color. Then it creates a mesh using
the specified geometry and adds it to the scene and
sets its X position.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function makeInstance(geometry, color, x) {
  const material = new THREE.MeshPhongMaterial({color});

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.x = x;

  return cube;
}
</pre>
<p>Then we'll call it 3 times with 3 different colors and X positions
saving the <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> instances in an array.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const cubes = [
  makeInstance(geometry, 0x44aa88,  0),
  makeInstance(geometry, 0x8844aa, -2),
  makeInstance(geometry, 0xaa8844,  2),
];
</pre>
<p>Finally we'll spin all 3 cubes in our render function. We
compute a slightly different rotation for each one.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {
  time *= 0.001;  // convert time to seconds

  cubes.forEach((cube, ndx) =&gt; {
    const speed = 1 + ndx * .1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });

  ...
</pre>
<p>and here's that.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/fundamentals-3-cubes.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/fundamentals-3-cubes.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>If you compare it to the top down diagram above you can see
it matches our expectations. With cubes at X = -2 and X = +2
they are partially outside our frustum. They are also
somewhat exaggeratedly warped since the field of view
across the canvas is so extreme.</p>
<p>Our program now has this structure</p>
<div class="threejs_center"><img src="../resources/images/threejs-3cubes-scene.svg" style="width: 610px;"></div>

<p>As you can see we have 3 <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> objects each referencing the same <a href="/docs/#api/en/geometries/BoxGeometry"><code class="notranslate" translate="no">BoxGeometry</code></a>.
Each <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> references a unique <a href="/docs/#api/en/materials/MeshPhongMaterial"><code class="notranslate" translate="no">MeshPhongMaterial</code></a> so that each cube can have
a different color.</p>
<p>I hope this short intro helps to get things started. <a href="responsive.html">Next up we'll cover
making our code responsive so it is adaptable to multiple situations</a>.</p>
<div id="es6" class="threejs_bottombar">
<h3>es6 modules, three.js, and folder structure</h3>
<p>As of version r147 the preferred way to use three.js is via <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import">es6 modules</a> and import maps.</p>
<p>
es6 modules can be loaded via the <code class="notranslate" translate="no">import</code> keyword in a script
or inline via a <code class="notranslate" translate="no">&lt;script type="module"&gt;</code> tag. Here's an example
</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;script type="module"&gt;
import * as THREE from 'three';

...

&lt;/script&gt;
</pre>
<p>
Notice <code class="notranslate" translate="no">'three'</code> specifier there. If you leave it as it is, it will likely produce an error. An <i>import map</i> should be used to tell the browser where to find three.js
</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;script type="importmap"&gt;
{
  "imports": {
    "three": "./path/to/three.module.js"
  }
}
&lt;/script&gt;
</pre>
<p>
Note that path specifier can start only with <code class="notranslate" translate="no">./</code> or <code class="notranslate" translate="no">../</code>.
</p>
<p>
To import addons like <a href="https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/OrbitControls.js"><code class="notranslate" translate="no">OrbitControls.js</code></a> use the following
</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
</pre>
<p>
Don't forget to add addons to the import map like so
</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;script type="importmap"&gt;
{
  "imports": {
    "three": "./path/to/three.module.js",
    "three/addons/": "./different/path/to/examples/jsm/"
  }
}
&lt;/script&gt;
</pre>
<p>
You can also use a CDN
</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;script type="importmap"&gt;
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@&lt;version&gt;/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@&lt;version&gt;/examples/jsm/"
  }
}
&lt;/script&gt;
</pre>
<p>
To conclude, the recommended way of using three.js is
</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">
&lt;script type="importmap"&gt;
{
  "imports": {
    "three": "./path/to/three.module.js",
    "three/addons/": "./different/path/to/examples/jsm/"
  }
}
&lt;/script&gt;

&lt;script type="module"&gt;
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

...

&lt;/script&gt;
</pre>
</div>

<!-- needed in English only to prevent warning from outdated translations -->
<p><a href="geometry.html"></a>
<a href="Geometry"></a></p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>


# game.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Making a Game</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Making a Game">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Making a Game</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>Many people want to write games using three.js. This article
will hopefully give you some ideas on how to start.</p>
<p>At least at the time I'm writing this article it's probably going to be the
longest article on this site. It's possible the code here is massively over
engineered but as I wrote each new feature I'd run into a problem that needed a
solution I'm used to from other games I've written. In other words each new
solution seemed important so I'll try to show why. Of course the smaller your
game the less you might need some of the solutions shown here but this is a
pretty small game and yet with the complexities of 3D characters many things
take more organization than they might with 2D characters.</p>
<p>As an example if you're making PacMan in 2D, when PacMan turns a corner
that happens instantly at 90 degrees. There is no in-between step. But
in a 3D game often we need the character to rotate over several frames.
That simple change can add a bunch of complexity and require different
solutions.</p>
<p>The majority of the code here will not really be three.js and
that's important to note, <strong>three.js is not a game engine</strong>.
Three.js is a 3D library. It provides a <a href="scenegraph.html">scene graph</a>
and features for displaying 3D objects added to that scene graph
but it does not provide all the other things needed to make a game.
No collisions, no physics, no input systems, no path finding, etc, etc...
So, we'll have to provide those things ourselves.</p>
<p>I ended up writing quite a bit of code to make this simple <em>unfinished</em>
game like thing and again, it's certainly possible I over engineered and there
are simpler solutions but I feel like I actually didn't write
enough code and hopefully I can explain what I think is missing.</p>
<p>Many of the ideas here are heavily influenced by <a href="https://unity.com">Unity</a>.
If you're not familiar with Unity that probably does not matter.
I only bring it up as 10s of 1000s of games have shipped using
these ideas.</p>
<p>Let's start with the three.js parts. We need to load models for our game.</p>
<p>At <a href="https://opengameart.org">opengameart.org</a> I found this <a href="https://opengameart.org/content/lowpoly-animated-knight">animated knight
model</a> by <a href="https://opengameart.org/users/quaternius">quaternius</a></p>
<div class="threejs_center"><img src="../resources/images/knight.jpg" style="width: 375px;"></div>

<p><a href="https://opengameart.org/users/quaternius">quaternius</a> also made <a href="https://opengameart.org/content/lowpoly-animated-farm-animal-pack">these animated animals</a>.</p>
<div class="threejs_center"><img src="../resources/images/animals.jpg" style="width: 606px;"></div>

<p>These seem like good models to start with so the first thing we need to
do is load them.</p>
<p>We covered <a href="load-gltf.html">loading glTF files before</a>.
The difference this time is we need to load multiple models and
we can't start the game until all the models are loaded.</p>
<p>Fortunately three.js provides the <a href="/docs/#api/en/loaders/managers/LoadingManager"><code class="notranslate" translate="no">LoadingManager</code></a> just for this purpose.
We create a <a href="/docs/#api/en/loaders/managers/LoadingManager"><code class="notranslate" translate="no">LoadingManager</code></a> and pass it to the other loaders. The
<a href="/docs/#api/en/loaders/managers/LoadingManager"><code class="notranslate" translate="no">LoadingManager</code></a> provides both <a href="/docs/#api/en/loaders/managers/LoadingManager#onProgress"><code class="notranslate" translate="no">onProgress</code></a> and
<a href="/docs/#api/en/loaders/managers/LoadingManager#onLoad"><code class="notranslate" translate="no">onLoad</code></a> properties we can attach callbacks to.
The <a href="/docs/#api/en/loaders/managers/LoadingManager#onLoad"><code class="notranslate" translate="no">onLoad</code></a> callback will be called when
all files have been loaded. The <a href="/docs/#api/en/loaders/managers/LoadingManager#onProgress"><code class="notranslate" translate="no">onProgress</code></a> callback
as called after each individual file arrives to give as a chance to show
loading progress.</p>
<p>Starting with the code from <a href="load-gltf.html">loading a glTF file</a> I removed all
the code related to framing the scene and added this code to load all models.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const manager = new THREE.LoadingManager();
manager.onLoad = init;
const models = {
  pig:    { url: 'resources/models/animals/Pig.gltf' },
  cow:    { url: 'resources/models/animals/Cow.gltf' },
  llama:  { url: 'resources/models/animals/Llama.gltf' },
  pug:    { url: 'resources/models/animals/Pug.gltf' },
  sheep:  { url: 'resources/models/animals/Sheep.gltf' },
  zebra:  { url: 'resources/models/animals/Zebra.gltf' },
  horse:  { url: 'resources/models/animals/Horse.gltf' },
  knight: { url: 'resources/models/knight/KnightCharacter.gltf' },
};
{
  const gltfLoader = new GLTFLoader(manager);
  for (const model of Object.values(models)) {
    gltfLoader.load(model.url, (gltf) =&gt; {
      model.gltf = gltf;
    });
  }
}

function init() {
  // TBD
}
</pre>
<p>This code will load all the models above and the <a href="/docs/#api/en/loaders/managers/LoadingManager"><code class="notranslate" translate="no">LoadingManager</code></a> will call
<code class="notranslate" translate="no">init</code> when done. We'll use the <code class="notranslate" translate="no">models</code> object later to let us access the
loaded models so the <a href="/docs/#examples/loaders/GLTFLoader"><code class="notranslate" translate="no">GLTFLoader</code></a> callback for each individual model attaches
the loaded data to that model's info.</p>
<p>All the models with all their animation are currently about 6.6meg. That's a
pretty big download. Assuming your server supports compression (the server this
site runs on does) it's able to compress them to around 1.4meg. That's
definitely better than 6.6meg bit it's still not a tiny amount of data. It would
probably be good if we added a progress bar so the user has some idea how much
longer they have to wait.</p>
<p>So, let's add an <a href="/docs/#api/en/loaders/managers/LoadingManager#onProgress"><code class="notranslate" translate="no">onProgress</code></a> callback. It will be
called with 3 arguments, the <code class="notranslate" translate="no">url</code> of the last loaded object and then the number
of items loaded so far as well as the total number of items.</p>
<p>Let's setup some HTML for a loading bar</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;body&gt;
  &lt;canvas id="c"&gt;&lt;/canvas&gt;
+  &lt;div id="loading"&gt;
+    &lt;div&gt;
+      &lt;div&gt;...loading...&lt;/div&gt;
+      &lt;div class="progress"&gt;&lt;div id="progressbar"&gt;&lt;/div&gt;&lt;/div&gt;
+    &lt;/div&gt;
+  &lt;/div&gt;
&lt;/body&gt;
</pre>
<p>We'll look up the <code class="notranslate" translate="no">#progressbar</code> div and we can set the width from 0% to 100%
to show our progress. All we need to do is set that in our callback.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const manager = new THREE.LoadingManager();
manager.onLoad = init;

+const progressbarElem = document.querySelector('#progressbar');
+manager.onProgress = (url, itemsLoaded, itemsTotal) =&gt; {
+  progressbarElem.style.width = `${itemsLoaded / itemsTotal * 100 | 0}%`;
+};
</pre>
<p>We already setup <code class="notranslate" translate="no">init</code> to be called when all the models are loaded so
we can turn off the progress bar by hiding the <code class="notranslate" translate="no">#loading</code> element.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function init() {
+  // hide the loading bar
+  const loadingElem = document.querySelector('#loading');
+  loadingElem.style.display = 'none';
}
</pre>
<p>Here's a bunch of CSS for styling the bar. The CSS makes the <code class="notranslate" translate="no">#loading</code> <code class="notranslate" translate="no">&lt;div&gt;</code>
the full size of the page and centers its children. The CSS makes a <code class="notranslate" translate="no">.progress</code>
area to contain the progress bar. The CSS also gives the progress bar
a CSS animation of diagonal stripes.</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">#loading {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: xx-large;
  font-family: sans-serif;
}
#loading&gt;div&gt;div {
  padding: 2px;
}
.progress {
  width: 50vw;
  border: 1px solid black;
}
#progressbar {
  width: 0;
  transition: width ease-out .5s;
  height: 1em;
  background-color: #888;
  background-image: linear-gradient(
    -45deg,
    rgba(255, 255, 255, .5) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, .5) 50%,
    rgba(255, 255, 255, .5) 75%,
    transparent 75%,
    transparent
  );
  background-size: 50px 50px;
  animation: progressanim 2s linear infinite;
}

@keyframes progressanim {
  0% {
    background-position: 50px 50px;
  }
  100% {
    background-position: 0 0;
  }
}
</pre>
<p>Now that we have a progress bar let's deal with the models. These models
have animations and we want to be able to access those animations.
Animations are stored in an array by default be we'd like to be able to
easily access them by name so let's setup an <code class="notranslate" translate="no">animations</code> property for
each model to do that. Note of course this means animations must have unique names.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+function prepModelsAndAnimations() {
+  Object.values(models).forEach(model =&gt; {
+    const animsByName = {};
+    model.gltf.animations.forEach((clip) =&gt; {
+      animsByName[clip.name] = clip;
+    });
+    model.animations = animsByName;
+  });
+}

function init() {
  // hide the loading bar
  const loadingElem = document.querySelector('#loading');
  loadingElem.style.display = 'none';

+  prepModelsAndAnimations();
}
</pre>
<p>Let's display the animated models.</p>
<p>Unlike the <a href="load-gltf.html">previous example of loading a glTF file</a>
This time we probably want to be able to display more than one instance
of each model. To do this, instead of adding
the loaded gltf scene directly like we did in <a href="load-gltf.html">the article on loading a glTF</a>,
we instead want to clone the scene and in particular we want to clone
it for skinned animated characters. Fortunately there's a utility function,
<code class="notranslate" translate="no">SkeletonUtils.clone</code> we can use to do this. So, first we need to include
the utils.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
+import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
</pre>
<p>Then we can clone the models we just loaded</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function init() {
  // hide the loading bar
  const loadingElem = document.querySelector('#loading');
  loadingElem.style.display = 'none';

  prepModelsAndAnimations();

+  Object.values(models).forEach((model, ndx) =&gt; {
+    const clonedScene = SkeletonUtils.clone(model.gltf.scene);
+    const root = new THREE.Object3D();
+    root.add(clonedScene);
+    scene.add(root);
+    root.position.x = (ndx - 3) * 3;
+  });
}
</pre>
<p>Above, for each model, we clone the <code class="notranslate" translate="no">gltf.scene</code> we loaded and we parent that
to a new <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a>. We need to parent it to another object because when
we play animations the animation will apply animated positions to the nodes
in the loaded scene which means we won't have control over those positions.</p>
<p>To play the animations each model we clone needs an <a href="/docs/#api/en/animation/AnimationMixer"><code class="notranslate" translate="no">AnimationMixer</code></a>.
An <a href="/docs/#api/en/animation/AnimationMixer"><code class="notranslate" translate="no">AnimationMixer</code></a> contains 1 or more <a href="/docs/#api/en/animation/AnimationAction"><code class="notranslate" translate="no">AnimationAction</code></a>s. An
<a href="/docs/#api/en/animation/AnimationAction"><code class="notranslate" translate="no">AnimationAction</code></a> references an <a href="/docs/#api/en/animation/AnimationClip"><code class="notranslate" translate="no">AnimationClip</code></a>. <a href="/docs/#api/en/animation/AnimationAction"><code class="notranslate" translate="no">AnimationAction</code></a>s
have all kinds of settings for playing then chaining to another
action or cross fading between actions. Let's just get the first
<a href="/docs/#api/en/animation/AnimationClip"><code class="notranslate" translate="no">AnimationClip</code></a> and create an action for it. The default is for
an action to play its clip in a loop forever.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const mixers = [];

function init() {
  // hide the loading bar
  const loadingElem = document.querySelector('#loading');
  loadingElem.style.display = 'none';

  prepModelsAndAnimations();

  Object.values(models).forEach((model, ndx) =&gt; {
    const clonedScene = SkeletonUtils.clone(model.gltf.scene);
    const root = new THREE.Object3D();
    root.add(clonedScene);
    scene.add(root);
    root.position.x = (ndx - 3) * 3;

+    const mixer = new THREE.AnimationMixer(clonedScene);
+    const firstClip = Object.values(model.animations)[0];
+    const action = mixer.clipAction(firstClip);
+    action.play();
+    mixers.push(mixer);
  });
}
</pre>
<p>We called <a href="/docs/#api/en/animation/AnimationAction#play"><code class="notranslate" translate="no">play</code></a> to start the action and stored
off all the <code class="notranslate" translate="no">AnimationMixers</code> in an array called <code class="notranslate" translate="no">mixers</code>. Finally
we need to update each <a href="/docs/#api/en/animation/AnimationMixer"><code class="notranslate" translate="no">AnimationMixer</code></a> in our render loop by computing
the time since the last frame and passing that to <a href="/docs/#api/en/animation/AnimationMixer.update"><code class="notranslate" translate="no">AnimationMixer.update</code></a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+let then = 0;
function render(now) {
+  now *= 0.001;  // convert to seconds
+  const deltaTime = now - then;
+  then = now;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

+  for (const mixer of mixers) {
+    mixer.update(deltaTime);
+  }

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
</pre>
<p>And with that we should get each model loaded and playing its first animation.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/game-load-models.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/game-load-models.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Let's make it so we can check all of the animations.
We'll add all of the clips as actions and then enable just one at
a time.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-const mixers = [];
+const mixerInfos = [];

function init() {
  // hide the loading bar
  const loadingElem = document.querySelector('#loading');
  loadingElem.style.display = 'none';

  prepModelsAndAnimations();

  Object.values(models).forEach((model, ndx) =&gt; {
    const clonedScene = SkeletonUtils.clone(model.gltf.scene);
    const root = new THREE.Object3D();
    root.add(clonedScene);
    scene.add(root);
    root.position.x = (ndx - 3) * 3;

    const mixer = new THREE.AnimationMixer(clonedScene);
-    const firstClip = Object.values(model.animations)[0];
-    const action = mixer.clipAction(firstClip);
-    action.play();
-    mixers.push(mixer);
+    const actions = Object.values(model.animations).map((clip) =&gt; {
+      return mixer.clipAction(clip);
+    });
+    const mixerInfo = {
+      mixer,
+      actions,
+      actionNdx: -1,
+    };
+    mixerInfos.push(mixerInfo);
+    playNextAction(mixerInfo);
  });
}

+function playNextAction(mixerInfo) {
+  const {actions, actionNdx} = mixerInfo;
+  const nextActionNdx = (actionNdx + 1) % actions.length;
+  mixerInfo.actionNdx = nextActionNdx;
+  actions.forEach((action, ndx) =&gt; {
+    const enabled = ndx === nextActionNdx;
+    action.enabled = enabled;
+    if (enabled) {
+      action.play();
+    }
+  });
+}
</pre>
<p>The code above makes an array of <a href="/docs/#api/en/animation/AnimationAction"><code class="notranslate" translate="no">AnimationAction</code></a>s,
one for each <a href="/docs/#api/en/animation/AnimationClip"><code class="notranslate" translate="no">AnimationClip</code></a>. It makes an array of objects, <code class="notranslate" translate="no">mixerInfos</code>,
with references to the <a href="/docs/#api/en/animation/AnimationMixer"><code class="notranslate" translate="no">AnimationMixer</code></a> and all the <a href="/docs/#api/en/animation/AnimationAction"><code class="notranslate" translate="no">AnimationAction</code></a>s
for each model. It then calls <code class="notranslate" translate="no">playNextAction</code> which sets <code class="notranslate" translate="no">enabled</code> on
all but one action for that mixer.</p>
<p>We need to update the render loop for the new array</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-for (const mixer of mixers) {
+for (const {mixer} of mixerInfos) {
  mixer.update(deltaTime);
}
</pre>
<p>Let's make it so pressing a key 1 to 8 will play the next animation
for each model</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">window.addEventListener('keydown', (e) =&gt; {
  const mixerInfo = mixerInfos[e.keyCode - 49];
  if (!mixerInfo) {
    return;
  }
  playNextAction(mixerInfo);
});
</pre>
<p>Now you should be able to click on the example and then press keys 1 through 8
to cycle each of the models through their available animations.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/game-check-animations.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/game-check-animations.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>So that is arguably the sum-total of the three.js portion of this
article. We covered loading multiple files, cloning skinned models,
and playing animations on them. In a real game you'd have to do a
ton more manipulation of <a href="/docs/#api/en/animation/AnimationAction"><code class="notranslate" translate="no">AnimationAction</code></a> objects.</p>
<p>Let's start making a game infrastructure</p>
<p>A common pattern for making a modern game is to use an
<a href="https://www.google.com/search?q=entity+component+system">Entity Component System</a>.
In an Entity Component System an object in a game is called an <em>entity</em> that consists
of a bunch of <em>components</em>. You build up entities by deciding which components to
attach to them. So, let's make an Entity Component System.</p>
<p>We'll call our entities <code class="notranslate" translate="no">GameObject</code>. It's effectively just a collection
of components and a three.js <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function removeArrayElement(array, element) {
  const ndx = array.indexOf(element);
  if (ndx &gt;= 0) {
    array.splice(ndx, 1);
  }
}

class GameObject {
  constructor(parent, name) {
    this.name = name;
    this.components = [];
    this.transform = new THREE.Object3D();
    parent.add(this.transform);
  }
  addComponent(ComponentType, ...args) {
    const component = new ComponentType(this, ...args);
    this.components.push(component);
    return component;
  }
  removeComponent(component) {
    removeArrayElement(this.components, component);
  }
  getComponent(ComponentType) {
    return this.components.find(c =&gt; c instanceof ComponentType);
  }
  update() {
    for (const component of this.components) {
      component.update();
    }
  }
}
</pre>
<p>Calling <code class="notranslate" translate="no">GameObject.update</code> calls <code class="notranslate" translate="no">update</code> on all the components.</p>
<p>I included a name only to help in debugging so if I look at a <code class="notranslate" translate="no">GameObject</code>
in the debugger I can see a name to help identify it.</p>
<p>Some things that might seem a little strange:</p>
<p><code class="notranslate" translate="no">GameObject.addComponent</code> is used to create components. Whether or not
this a good idea or a bad idea I'm not sure. My thinking was it makes
no sense for a component to exist outside of a gameobject so I thought
it might be good if creating a component automatically added that component
to the gameobject and passed the gameobject to the component's constructor.
In other words to add a component you do this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const gameObject = new GameObject(scene, 'foo');
gameObject.addComponent(TypeOfComponent);
</pre>
<p>If I didn't do it this way you'd instead do something like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const gameObject = new GameObject(scene, 'foo');
const component = new TypeOfComponent(gameObject);
gameObject.addComponent(component);
</pre>
<p>Is it better that the first way is shorter and more automated or is it worse
because it looks out of the ordinary? I don't know.</p>
<p><code class="notranslate" translate="no">GameObject.getComponent</code> looks up components by type. That has
the implication that you can not have 2 components of the same
type on a single game object or at least if you do you can only
look up the first one without adding some other API.</p>
<p>It's common for one component to look up another and when looking them up they
have to match by type otherwise you might get the wrong one. We could instead
give each component a name and you could look them up by name. That would be
more flexible in that you could have more than one component of the same type but it
would also be more tedious. Again, I'm not sure which is better.</p>
<p>On to the components themselves. Here is their base class.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// Base for all components
class Component {
  constructor(gameObject) {
    this.gameObject = gameObject;
  }
  update() {
  }
}
</pre>
<p>Do components need a base class? JavaScript is not like most strictly
typed languages so effectively we could have no base class and just
leave it up to each component to do whatever it wants in its constructor
knowing that the first argument is always the component's gameobject.
If it doesn't care about gameobject it wouldn't store it. I kind of feel like this
common base is good though. It means if you have a reference to a
component you know you can find its parent gameobject always and from its
parent you can easily look up other components as well as look at its
transform.</p>
<p>To manage the gameobjects we probably need some kind of gameobject manager. You
might think we could just keep an array of gameobjects but in a real game the
components of a gameobject might add and remove other gameobjects at runtime.
For example a gun gameobject might add a bullet gameobject every time the gun
fires. A monster gameobject might remove itself if it has been killed. We then
would have an issue that we might have code like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">for (const gameObject of globalArrayOfGameObjects) {
  gameObject.update();
}
</pre>
<p>The loop above would fail or do un-expected things if
gameobjects are added or removed from <code class="notranslate" translate="no">globalArrayOfGameObjects</code>
in the middle of the loop in some component's <code class="notranslate" translate="no">update</code> function.</p>
<p>To try to prevent that problem we need something a little safer.
Here's one attempt.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class SafeArray {
  constructor() {
    this.array = [];
    this.addQueue = [];
    this.removeQueue = new Set();
  }
  get isEmpty() {
    return this.addQueue.length + this.array.length &gt; 0;
  }
  add(element) {
    this.addQueue.push(element);
  }
  remove(element) {
    this.removeQueue.add(element);
  }
  forEach(fn) {
    this._addQueued();
    this._removeQueued();
    for (const element of this.array) {
      if (this.removeQueue.has(element)) {
        continue;
      }
      fn(element);
    }
    this._removeQueued();
  }
  _addQueued() {
    if (this.addQueue.length) {
      this.array.splice(this.array.length, 0, ...this.addQueue);
      this.addQueue = [];
    }
  }
  _removeQueued() {
    if (this.removeQueue.size) {
      this.array = this.array.filter(element =&gt; !this.removeQueue.has(element));
      this.removeQueue.clear();
    }
  }
}
</pre>
<p>The class above lets you add or remove elements from the <code class="notranslate" translate="no">SafeArray</code>
but won't mess with the array itself while it's being iterated over. Instead
new elements get added to <code class="notranslate" translate="no">addQueue</code> and removed elements to the <code class="notranslate" translate="no">removeQueue</code>
and then added or removed outside of the loop.</p>
<p>Using that here is our class to manage gameobjects.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class GameObjectManager {
  constructor() {
    this.gameObjects = new SafeArray();
  }
  createGameObject(parent, name) {
    const gameObject = new GameObject(parent, name);
    this.gameObjects.add(gameObject);
    return gameObject;
  }
  removeGameObject(gameObject) {
    this.gameObjects.remove(gameObject);
  }
  update() {
    this.gameObjects.forEach(gameObject =&gt; gameObject.update());
  }
}
</pre>
<p>With all that now let's make our first component. This component
will just manage a skinned three.js object like the ones we just created.
To keep it simple it will just have one method, <code class="notranslate" translate="no">setAnimation</code> that
takes the name of the animation to play and plays it.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class SkinInstance extends Component {
  constructor(gameObject, model) {
    super(gameObject);
    this.model = model;
    this.animRoot = SkeletonUtils.clone(this.model.gltf.scene);
    this.mixer = new THREE.AnimationMixer(this.animRoot);
    gameObject.transform.add(this.animRoot);
    this.actions = {};
  }
  setAnimation(animName) {
    const clip = this.model.animations[animName];
    // turn off all current actions
    for (const action of Object.values(this.actions)) {
      action.enabled = false;
    }
    // get or create existing action for clip
    const action = this.mixer.clipAction(clip);
    action.enabled = true;
    action.reset();
    action.play();
    this.actions[animName] = action;
  }
  update() {
    this.mixer.update(globals.deltaTime);
  }
}
</pre>
<p>You can see it's basically the code we had before that clones the scene we loaded,
then sets up an <a href="/docs/#api/en/animation/AnimationMixer"><code class="notranslate" translate="no">AnimationMixer</code></a>. <code class="notranslate" translate="no">setAnimation</code> adds a <a href="/docs/#api/en/animation/AnimationAction"><code class="notranslate" translate="no">AnimationAction</code></a> for a
particular <a href="/docs/#api/en/animation/AnimationClip"><code class="notranslate" translate="no">AnimationClip</code></a> if one does not already exist and disables all
existing actions.</p>
<p>The code references <code class="notranslate" translate="no">globals.deltaTime</code>. Let's make a globals object</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const globals = {
  time: 0,
  deltaTime: 0,
};
</pre>
<p>And update it in the render loop</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">let then = 0;
function render(now) {
  // convert to seconds
  globals.time = now * 0.001;
  // make sure delta time isn't too big.
  globals.deltaTime = Math.min(globals.time - then, 1 / 20);
  then = globals.time;
</pre>
<p>The check above for making sure <code class="notranslate" translate="no">deltaTime</code> is not more than 1/20th
of a second is because otherwise we'd get a huge value for <code class="notranslate" translate="no">deltaTime</code>
if we hide the tab. We might hide it for seconds or minutes and then
when our tab was brought to the front <code class="notranslate" translate="no">deltaTime</code> would be huge
and might teleport characters across our game world if we had code like</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">position += velocity * deltaTime;
</pre>
<p>By limiting the maximum <code class="notranslate" translate="no">deltaTime</code> that issue is prevented.</p>
<p>Now let's make a component for the player.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class Player extends Component {
  constructor(gameObject) {
    super(gameObject);
    const model = models.knight;
    this.skinInstance = gameObject.addComponent(SkinInstance, model);
    this.skinInstance.setAnimation('Run');
  }
}
</pre>
<p>The player calls <code class="notranslate" translate="no">setAnimation</code> with <code class="notranslate" translate="no">'Run'</code>. To know which animations
are available I modified our previous example to print out the names of
the animations</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function prepModelsAndAnimations() {
  Object.values(models).forEach(model =&gt; {
+    console.log('-------&gt;:', model.url);
    const animsByName = {};
    model.gltf.animations.forEach((clip) =&gt; {
      animsByName[clip.name] = clip;
+      console.log('  ', clip.name);
    });
    model.animations = animsByName;
  });
}
</pre>
<p>And running it got this list in <a href="https://developers.google.com/web/tools/chrome-devtools/console/javascript">the JavaScript console</a>.</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no"> -------&gt;:  resources/models/animals/Pig.gltf
    Idle
    Death
    WalkSlow
    Jump
    Walk
 -------&gt;:  resources/models/animals/Cow.gltf
    Walk
    Jump
    WalkSlow
    Death
    Idle
 -------&gt;:  resources/models/animals/Llama.gltf
    Jump
    Idle
    Walk
    Death
    WalkSlow
 -------&gt;:  resources/models/animals/Pug.gltf
    Jump
    Walk
    Idle
    WalkSlow
    Death
 -------&gt;:  resources/models/animals/Sheep.gltf
    WalkSlow
    Death
    Jump
    Walk
    Idle
 -------&gt;:  resources/models/animals/Zebra.gltf
    Jump
    Walk
    Death
    WalkSlow
    Idle
 -------&gt;:  resources/models/animals/Horse.gltf
    Jump
    WalkSlow
    Death
    Walk
    Idle
 -------&gt;:  resources/models/knight/KnightCharacter.gltf
    Run_swordRight
    Run
    Idle_swordLeft
    Roll_sword
    Idle
    Run_swordAttack
</pre><p>Fortunately the names of the animations for all the animals match
which will come in handy later. For now we only care the that the
player has an animation called <code class="notranslate" translate="no">Run</code>.</p>
<p>Let's use these components. Here's the updated init function.
All it does is create a <code class="notranslate" translate="no">GameObject</code> and add a <code class="notranslate" translate="no">Player</code> component to it.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const globals = {
  time: 0,
  deltaTime: 0,
};
+const gameObjectManager = new GameObjectManager();

function init() {
  // hide the loading bar
  const loadingElem = document.querySelector('#loading');
  loadingElem.style.display = 'none';

  prepModelsAndAnimations();

+  {
+    const gameObject = gameObjectManager.createGameObject(scene, 'player');
+    gameObject.addComponent(Player);
+  }
}
</pre>
<p>And we need to call <code class="notranslate" translate="no">gameObjectManager.update</code> in our render loop</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">let then = 0;
function render(now) {
  // convert to seconds
  globals.time = now * 0.001;
  // make sure delta time isn't too big.
  globals.deltaTime = Math.min(globals.time - then, 1 / 20);
  then = globals.time;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

-  for (const {mixer} of mixerInfos) {
-    mixer.update(deltaTime);
-  }
+  gameObjectManager.update();

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
</pre>
<p>and if we run that we get a single player.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/game-just-player.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/game-just-player.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>That was a lot of code just for an entity component system but
it's infrastructure that most games need.</p>
<p>Let's add an input system. Rather than read keys directly we'll
make a class that other parts of the code can check <code class="notranslate" translate="no">left</code> or <code class="notranslate" translate="no">right</code>.
That way we can assign multiple ways to input <code class="notranslate" translate="no">left</code> or <code class="notranslate" translate="no">right</code> etc..
We'll start with just keys</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// Keeps the state of keys/buttons
//
// You can check
//
//   inputManager.keys.left.down
//
// to see if the left key is currently held down
// and you can check
//
//   inputManager.keys.left.justPressed
//
// To see if the left key was pressed this frame
//
// Keys are 'left', 'right', 'a', 'b', 'up', 'down'
class InputManager {
  constructor() {
    this.keys = {};
    const keyMap = new Map();

    const setKey = (keyName, pressed) =&gt; {
      const keyState = this.keys[keyName];
      keyState.justPressed = pressed &amp;&amp; !keyState.down;
      keyState.down = pressed;
    };

    const addKey = (keyCode, name) =&gt; {
      this.keys[name] = { down: false, justPressed: false };
      keyMap.set(keyCode, name);
    };

    const setKeyFromKeyCode = (keyCode, pressed) =&gt; {
      const keyName = keyMap.get(keyCode);
      if (!keyName) {
        return;
      }
      setKey(keyName, pressed);
    };

    addKey(37, 'left');
    addKey(39, 'right');
    addKey(38, 'up');
    addKey(40, 'down');
    addKey(90, 'a');
    addKey(88, 'b');

    window.addEventListener('keydown', (e) =&gt; {
      setKeyFromKeyCode(e.keyCode, true);
    });
    window.addEventListener('keyup', (e) =&gt; {
      setKeyFromKeyCode(e.keyCode, false);
    });
  }
  update() {
    for (const keyState of Object.values(this.keys)) {
      if (keyState.justPressed) {
        keyState.justPressed = false;
      }
    }
  }
}
</pre>
<p>The code above tracks whether keys are up or down and you can check
if a key is currently pressed by checking for example
<code class="notranslate" translate="no">inputManager.keys.left.down</code>. It also has a <code class="notranslate" translate="no">justPressed</code> property
for each key so that you can check the user just pressed the key.
For example a jump key you don't want to know if the button is being
held down, you want to know did the user press it now.</p>
<p>Let's create an instance of <code class="notranslate" translate="no">InputManager</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const globals = {
  time: 0,
  deltaTime: 0,
};
const gameObjectManager = new GameObjectManager();
+const inputManager = new InputManager();
</pre>
<p>and update it in our render loop</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(now) {

  ...

  gameObjectManager.update();
+  inputManager.update();

  ...
}
</pre>
<p>It needs to be called after <code class="notranslate" translate="no">gameObjectManager.update</code> otherwise
<code class="notranslate" translate="no">justPressed</code> would never be true inside a component's <code class="notranslate" translate="no">update</code> function.</p>
<p>Let's use it in the <code class="notranslate" translate="no">Player</code> component</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const kForward = new THREE.Vector3(0, 0, 1);
const globals = {
  time: 0,
  deltaTime: 0,
+  moveSpeed: 16,
};

class Player extends Component {
  constructor(gameObject) {
    super(gameObject);
    const model = models.knight;
    this.skinInstance = gameObject.addComponent(SkinInstance, model);
    this.skinInstance.setAnimation('Run');
+    this.turnSpeed = globals.moveSpeed / 4;
  }
+  update() {
+    const {deltaTime, moveSpeed} = globals;
+    const {transform} = this.gameObject;
+    const delta = (inputManager.keys.left.down  ?  1 : 0) +
+                  (inputManager.keys.right.down ? -1 : 0);
+    transform.rotation.y += this.turnSpeed * delta * deltaTime;
+    transform.translateOnAxis(kForward, moveSpeed * deltaTime);
+  }
}
</pre>
<p>The code above uses <a href="/docs/#api/en/core/Object3D.transformOnAxis"><code class="notranslate" translate="no">Object3D.transformOnAxis</code></a> to move the player
forward. <a href="/docs/#api/en/core/Object3D.transformOnAxis"><code class="notranslate" translate="no">Object3D.transformOnAxis</code></a> works in local space so it only
works if the object in question is at the root of the scene, not if it's
parented to something else <a class="footnote" href="#parented" id="parented-backref">1</a></p>
<p>We also added a global <code class="notranslate" translate="no">moveSpeed</code> and based a <code class="notranslate" translate="no">turnSpeed</code> on the move speed.
The turn speed is based on the move speed to try to make sure a character
can turn sharply enough to meet its target. If <code class="notranslate" translate="no">turnSpeed</code> so too small
a character will turn around and around circling its target but never
hitting it. I didn't bother to do the math to calculate the required
turn speed for a given move speed. I just guessed.</p>
<p>The code so far would work but if the player runs off the screen there's no
way to find out where they are. Let's make it so if they are offscreen
for more than a certain time they get teleported back to the origin.
We can do that by using the three.js <a href="/docs/#api/en/math/Frustum"><code class="notranslate" translate="no">Frustum</code></a> class to check if a point
is inside the camera's view frustum.</p>
<p>We need to build a frustum from the camera. We could do this in the Player
component but other objects might want to use this too so let's add another
gameobject with a component to manage a frustum.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class CameraInfo extends Component {
  constructor(gameObject) {
    super(gameObject);
    this.projScreenMatrix = new THREE.Matrix4();
    this.frustum = new THREE.Frustum();
  }
  update() {
    const {camera} = globals;
    this.projScreenMatrix.multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse);
    this.frustum.setFromProjectionMatrix(this.projScreenMatrix);
  }
}
</pre>
<p>Then let's setup another gameobject at init time.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function init() {
  // hide the loading bar
  const loadingElem = document.querySelector('#loading');
  loadingElem.style.display = 'none';

  prepModelsAndAnimations();

+  {
+    const gameObject = gameObjectManager.createGameObject(camera, 'camera');
+    globals.cameraInfo = gameObject.addComponent(CameraInfo);
+  }

  {
    const gameObject = gameObjectManager.createGameObject(scene, 'player');
    gameObject.addComponent(Player);
  }
}
</pre>
<p>and now we can use it in the <code class="notranslate" translate="no">Player</code> component.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class Player extends Component {
  constructor(gameObject) {
    super(gameObject);
    const model = models.knight;
    this.skinInstance = gameObject.addComponent(SkinInstance, model);
    this.skinInstance.setAnimation('Run');
    this.turnSpeed = globals.moveSpeed / 4;
+    this.offscreenTimer = 0;
+    this.maxTimeOffScreen = 3;
  }
  update() {
-    const {deltaTime, moveSpeed} = globals;
+    const {deltaTime, moveSpeed, cameraInfo} = globals;
    const {transform} = this.gameObject;
    const delta = (inputManager.keys.left.down  ?  1 : 0) +
                  (inputManager.keys.right.down ? -1 : 0);
    transform.rotation.y += this.turnSpeed * delta * deltaTime;
    transform.translateOnAxis(kForward, moveSpeed * deltaTime);

+    const {frustum} = cameraInfo;
+    if (frustum.containsPoint(transform.position)) {
+      this.offscreenTimer = 0;
+    } else {
+      this.offscreenTimer += deltaTime;
+      if (this.offscreenTimer &gt;= this.maxTimeOffScreen) {
+        transform.position.set(0, 0, 0);
+      }
+    }
  }
}
</pre>
<p>One more thing before we try it out, let's add touchscreen support
for mobile. First let's add some HTML to touch</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;body&gt;
  &lt;canvas id="c"&gt;&lt;/canvas&gt;
+  &lt;div id="ui"&gt;
+    &lt;div id="left"&gt;&lt;img src="../resources/images/left.svg"&gt;&lt;/div&gt;
+    &lt;div style="flex: 0 0 40px;"&gt;&lt;/div&gt;
+    &lt;div id="right"&gt;&lt;img src="../resources/images/right.svg"&gt;&lt;/div&gt;
+  &lt;/div&gt;
  &lt;div id="loading"&gt;
    &lt;div&gt;
      &lt;div&gt;...loading...&lt;/div&gt;
      &lt;div class="progress"&gt;&lt;div id="progressbar"&gt;&lt;/div&gt;&lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/body&gt;
</pre>
<p>and some CSS to style it</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">#ui {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-items: center;
  align-content: stretch;
}
#ui&gt;div {
  display: flex;
  align-items: flex-end;
  flex: 1 1 auto;
}
.bright {
  filter: brightness(2);
}
#left {
  justify-content: flex-end;
}
#right {
  justify-content: flex-start;
}
#ui img {
  padding: 10px;
  width: 80px;
  height: 80px;
  display: block;
}
</pre>
<p>The idea here is there is one div, <code class="notranslate" translate="no">#ui</code>, that
covers the entire page. Inside will be 2 divs, <code class="notranslate" translate="no">#left</code> and <code class="notranslate" translate="no">#right</code>
both of which are almost half the page wide and the entire screen tall.
In between there is a 40px separator. If the user slides their finger
over the left or right side then we need up update <code class="notranslate" translate="no">keys.left</code> and <code class="notranslate" translate="no">keys.right</code>
in the <code class="notranslate" translate="no">InputManager</code>. This makes the entire screen sensitive to being touched
which seemed better than just small arrows.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class InputManager {
  constructor() {
    this.keys = {};
    const keyMap = new Map();

    const setKey = (keyName, pressed) =&gt; {
      const keyState = this.keys[keyName];
      keyState.justPressed = pressed &amp;&amp; !keyState.down;
      keyState.down = pressed;
    };

    const addKey = (keyCode, name) =&gt; {
      this.keys[name] = { down: false, justPressed: false };
      keyMap.set(keyCode, name);
    };

    const setKeyFromKeyCode = (keyCode, pressed) =&gt; {
      const keyName = keyMap.get(keyCode);
      if (!keyName) {
        return;
      }
      setKey(keyName, pressed);
    };

    addKey(37, 'left');
    addKey(39, 'right');
    addKey(38, 'up');
    addKey(40, 'down');
    addKey(90, 'a');
    addKey(88, 'b');

    window.addEventListener('keydown', (e) =&gt; {
      setKeyFromKeyCode(e.keyCode, true);
    });
    window.addEventListener('keyup', (e) =&gt; {
      setKeyFromKeyCode(e.keyCode, false);
    });

+    const sides = [
+      { elem: document.querySelector('#left'),  key: 'left'  },
+      { elem: document.querySelector('#right'), key: 'right' },
+    ];
+
+    const clearKeys = () =&gt; {
+      for (const {key} of sides) {
+          setKey(key, false);
+      }
+    };
+
+    const handleMouseMove = (e) =&gt; {
+      e.preventDefault();
+      // this is needed because we call preventDefault();
+      // we also gave the canvas a tabindex so it can
+      // become the focus
+      canvas.focus();
+      window.addEventListener('pointermove', handleMouseMove);
+      window.addEventListener('pointerup', handleMouseUp);
+
+      for (const {elem, key} of sides) {
+        let pressed = false;
+        const rect = elem.getBoundingClientRect();
+        const x = e.clientX;
+        const y = e.clientY;
+        const inRect = x &gt;= rect.left &amp;&amp; x &lt; rect.right &amp;&amp;
+                       y &gt;= rect.top &amp;&amp; y &lt; rect.bottom;
+        if (inRect) {
+          pressed = true;
+        }
+        setKey(key, pressed);
+      }
+    };
+
+    function handleMouseUp() {
+      clearKeys();
+      window.removeEventListener('pointermove', handleMouseMove, {passive: false});
+      window.removeEventListener('pointerup', handleMouseUp);
+    }
+
+    const uiElem = document.querySelector('#ui');
+    uiElem.addEventListener('pointerdown', handleMouseMove, {passive: false});
+
+    uiElem.addEventListener('touchstart', (e) =&gt; {
+      // prevent scrolling
+      e.preventDefault();
+    }, {passive: false});
  }
  update() {
    for (const keyState of Object.values(this.keys)) {
      if (keyState.justPressed) {
        keyState.justPressed = false;
      }
    }
  }
}
</pre>
<p>And now we should be able to control the character with the left and right
cursor keys or with our fingers on a touchscreen</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/game-player-input.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/game-player-input.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Ideally we'd do something else if the player went off the screen like move
the camera or maybe offscreen = death but this article is already going to be
too long so for now teleporting to the middle was the simplest thing.</p>
<p>Lets add some animals. We can start it off similar to the <code class="notranslate" translate="no">Player</code> by making
an <code class="notranslate" translate="no">Animal</code> component.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class Animal extends Component {
  constructor(gameObject, model) {
    super(gameObject);
    const skinInstance = gameObject.addComponent(SkinInstance, model);
    skinInstance.mixer.timeScale = globals.moveSpeed / 4;
    skinInstance.setAnimation('Idle');
  }
}
</pre>
<p>The code above sets the <a href="/docs/#api/en/animation/AnimationMixer.timeScale"><code class="notranslate" translate="no">AnimationMixer.timeScale</code></a> to set the playback
speed of the animations relative to the move speed. This way if we
adjust the move speed the animation will speed up or slow down as well.</p>
<p>To start we could setup one of each type of animal</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function init() {
  // hide the loading bar
  const loadingElem = document.querySelector('#loading');
  loadingElem.style.display = 'none';

  prepModelsAndAnimations();
  {
    const gameObject = gameObjectManager.createGameObject(camera, 'camera');
    globals.cameraInfo = gameObject.addComponent(CameraInfo);
  }

  {
    const gameObject = gameObjectManager.createGameObject(scene, 'player');
    globals.player = gameObject.addComponent(Player);
    globals.congaLine = [gameObject];
  }

+  const animalModelNames = [
+    'pig',
+    'cow',
+    'llama',
+    'pug',
+    'sheep',
+    'zebra',
+    'horse',
+  ];
+  animalModelNames.forEach((name, ndx) =&gt; {
+    const gameObject = gameObjectManager.createGameObject(scene, name);
+    gameObject.addComponent(Animal, models[name]);
+    gameObject.transform.position.x = (ndx + 1) * 5;
+  });
}
</pre>
<p>And that would get us animals standing on the screen but we want them to do
something.</p>
<p>Let's make them follow the player in a conga line but only if the player gets near enough.
To do this we need several states.</p>
<ul>
<li><p>Idle:</p>
<p>Animal is waiting for player to get close</p>
</li>
<li><p>Wait for End of Line:</p>
<p>Animal was tagged by player but now needs to wait for the animal
at the end of the line to come by so they can join the end of the line.</p>
</li>
<li><p>Go to Last:</p>
<p>Animal needs to walk to where the animal they are following was, at the same time recording
a history of where the animal they are following is currently.</p>
</li>
<li><p>Follow</p>
<p>Animal needs to keep recording a history of where the animal they are following is while
moving to where the animal they are following was before.</p>
</li>
</ul>
<p>There are many ways to handle different states like this. A common one is to use
a <a href="https://www.google.com/search?q=finite+state+machine">Finite State Machine</a> and
to build some class to help us manage the state.</p>
<p>So, let's do that.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class FiniteStateMachine {
  constructor(states, initialState) {
    this.states = states;
    this.transition(initialState);
  }
  get state() {
    return this.currentState;
  }
  transition(state) {
    const oldState = this.states[this.currentState];
    if (oldState &amp;&amp; oldState.exit) {
      oldState.exit.call(this);
    }
    this.currentState = state;
    const newState = this.states[state];
    if (newState.enter) {
      newState.enter.call(this);
    }
  }
  update() {
    const state = this.states[this.currentState];
    if (state.update) {
      state.update.call(this);
    }
  }
}
</pre>
<p>Here's a simple class. We pass it an object with a bunch of states.
Each state as 3 optional functions, <code class="notranslate" translate="no">enter</code>, <code class="notranslate" translate="no">update</code>, and <code class="notranslate" translate="no">exit</code>.
To switch states we call <code class="notranslate" translate="no">FiniteStateMachine.transition</code> and pass it
the name of the new state. If the current state has an <code class="notranslate" translate="no">exit</code> function
it's called. Then if the new state has an <code class="notranslate" translate="no">enter</code> function it's called.
Finally each frame <code class="notranslate" translate="no">FiniteStateMachine.update</code> calls the <code class="notranslate" translate="no">update</code> function
of the current state.</p>
<p>Let's use it to manage the states of the animals.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// Returns true of obj1 and obj2 are close
function isClose(obj1, obj1Radius, obj2, obj2Radius) {
  const minDist = obj1Radius + obj2Radius;
  const dist = obj1.position.distanceTo(obj2.position);
  return dist &lt; minDist;
}

// keeps v between -min and +min
function minMagnitude(v, min) {
  return Math.abs(v) &gt; min
      ? min * Math.sign(v)
      : v;
}

const aimTowardAndGetDistance = function() {
  const delta = new THREE.Vector3();

  return function aimTowardAndGetDistance(source, targetPos, maxTurn) {
    delta.subVectors(targetPos, source.position);
    // compute the direction we want to be facing
    const targetRot = Math.atan2(delta.x, delta.z) + Math.PI * 1.5;
    // rotate in the shortest direction
    const deltaRot = (targetRot - source.rotation.y + Math.PI * 1.5) % (Math.PI * 2) - Math.PI;
    // make sure we don't turn faster than maxTurn
    const deltaRotation = minMagnitude(deltaRot, maxTurn);
    // keep rotation between 0 and Math.PI * 2
    source.rotation.y = THREE.MathUtils.euclideanModulo(
        source.rotation.y + deltaRotation, Math.PI * 2);
    // return the distance to the target
    return delta.length();
  };
}();

class Animal extends Component {
  constructor(gameObject, model) {
    super(gameObject);
+    const hitRadius = model.size / 2;
    const skinInstance = gameObject.addComponent(SkinInstance, model);
    skinInstance.mixer.timeScale = globals.moveSpeed / 4;
+    const transform = gameObject.transform;
+    const playerTransform = globals.player.gameObject.transform;
+    const maxTurnSpeed = Math.PI * (globals.moveSpeed / 4);
+    const targetHistory = [];
+    let targetNdx = 0;
+
+    function addHistory() {
+      const targetGO = globals.congaLine[targetNdx];
+      const newTargetPos = new THREE.Vector3();
+      newTargetPos.copy(targetGO.transform.position);
+      targetHistory.push(newTargetPos);
+    }
+
+    this.fsm = new FiniteStateMachine({
+      idle: {
+        enter: () =&gt; {
+          skinInstance.setAnimation('Idle');
+        },
+        update: () =&gt; {
+          // check if player is near
+          if (isClose(transform, hitRadius, playerTransform, globals.playerRadius)) {
+            this.fsm.transition('waitForEnd');
+          }
+        },
+      },
+      waitForEnd: {
+        enter: () =&gt; {
+          skinInstance.setAnimation('Jump');
+        },
+        update: () =&gt; {
+          // get the gameObject at the end of the conga line
+          const lastGO = globals.congaLine[globals.congaLine.length - 1];
+          const deltaTurnSpeed = maxTurnSpeed * globals.deltaTime;
+          const targetPos = lastGO.transform.position;
+          aimTowardAndGetDistance(transform, targetPos, deltaTurnSpeed);
+          // check if last thing in conga line is near
+          if (isClose(transform, hitRadius, lastGO.transform, globals.playerRadius)) {
+            this.fsm.transition('goToLast');
+          }
+        },
+      },
+      goToLast: {
+        enter: () =&gt; {
+          // remember who we're following
+          targetNdx = globals.congaLine.length - 1;
+          // add ourselves to the conga line
+          globals.congaLine.push(gameObject);
+          skinInstance.setAnimation('Walk');
+        },
+        update: () =&gt; {
+          addHistory();
+          // walk to the oldest point in the history
+          const targetPos = targetHistory[0];
+          const maxVelocity = globals.moveSpeed * globals.deltaTime;
+          const deltaTurnSpeed = maxTurnSpeed * globals.deltaTime;
+          const distance = aimTowardAndGetDistance(transform, targetPos, deltaTurnSpeed);
+          const velocity = distance;
+          transform.translateOnAxis(kForward, Math.min(velocity, maxVelocity));
+          if (distance &lt;= maxVelocity) {
+            this.fsm.transition('follow');
+          }
+        },
+      },
+      follow: {
+        update: () =&gt; {
+          addHistory();
+          // remove the oldest history and just put ourselves there.
+          const targetPos = targetHistory.shift();
+          transform.position.copy(targetPos);
+          const deltaTurnSpeed = maxTurnSpeed * globals.deltaTime;
+          aimTowardAndGetDistance(transform, targetHistory[0], deltaTurnSpeed);
+        },
+      },
+    }, 'idle');
+  }
+  update() {
+    this.fsm.update();
+  }
}
</pre>
<p>That was big chunk of code but it does what was described above.
Hopefully of you walk through each state it will be clear.</p>
<p>A few things we need to add. We need the player to add itself
to the globals so the animals can find it and we need to start the
conga line with the player's <code class="notranslate" translate="no">GameObject</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function init() {

  ...

  {
    const gameObject = gameObjectManager.createGameObject(scene, 'player');
+    globals.player = gameObject.addComponent(Player);
+    globals.congaLine = [gameObject];
  }

}
</pre>
<p>We also need to compute a size for each model</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function prepModelsAndAnimations() {
+  const box = new THREE.Box3();
+  const size = new THREE.Vector3();
  Object.values(models).forEach(model =&gt; {
+    box.setFromObject(model.gltf.scene);
+    box.getSize(size);
+    model.size = size.length();
    const animsByName = {};
    model.gltf.animations.forEach((clip) =&gt; {
      animsByName[clip.name] = clip;
      // Should really fix this in .blend file
      if (clip.name === 'Walk') {
        clip.duration /= 2;
      }
    });
    model.animations = animsByName;
  });
}
</pre>
<p>And we need the player to record their size</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class Player extends Component {
  constructor(gameObject) {
    super(gameObject);
    const model = models.knight;
+    globals.playerRadius = model.size / 2;
</pre>
<p>Thinking about it now it would probably have been smarter
for the animals to just target the head of the conga line
instead of the player specifically. Maybe I'll come back
and change that later.</p>
<p>When I first started this I used just one radius for all animals
but of course that was no good as the pug is much smaller than the horse.
So I added the difference sizes but I wanted to be able to visualize
things. To do that I made a <code class="notranslate" translate="no">StatusDisplayHelper</code> component.</p>
<p>I uses a <a href="/docs/#api/en/helpers/PolarGridHelper"><code class="notranslate" translate="no">PolarGridHelper</code></a> to draw a circle around each character
and it uses html elements to let each character show some status using
the techniques covered in <a href="align-html-elements-to-3d.html">the article on aligning html elements to 3D</a>.</p>
<p>First we need to add some HTML to host these elements</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;body&gt;
  &lt;canvas id="c"&gt;&lt;/canvas&gt;
  &lt;div id="ui"&gt;
    &lt;div id="left"&gt;&lt;img src="../resources/images/left.svg"&gt;&lt;/div&gt;
    &lt;div style="flex: 0 0 40px;"&gt;&lt;/div&gt;
    &lt;div id="right"&gt;&lt;img src="../resources/images/right.svg"&gt;&lt;/div&gt;
  &lt;/div&gt;
  &lt;div id="loading"&gt;
    &lt;div&gt;
      &lt;div&gt;...loading...&lt;/div&gt;
      &lt;div class="progress"&gt;&lt;div id="progressbar"&gt;&lt;/div&gt;&lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
+  &lt;div id="labels"&gt;&lt;/div&gt;
&lt;/body&gt;
</pre>
<p>And add some CSS for them</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">#labels {
  position: absolute;  /* let us position ourself inside the container */
  left: 0;             /* make our position the top left of the container */
  top: 0;
  color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}
#labels&gt;div {
  position: absolute;  /* let us position them inside the container */
  left: 0;             /* make their default position the top left of the container */
  top: 0;
  font-size: large;
  font-family: monospace;
  user-select: none;   /* don't let the text get selected */
  text-shadow:         /* create a black outline */
    -1px -1px 0 #000,
     0   -1px 0 #000,
     1px -1px 0 #000,
     1px  0   0 #000,
     1px  1px 0 #000,
     0    1px 0 #000,
    -1px  1px 0 #000,
    -1px  0   0 #000;
}
</pre>
<p>Then here's the component</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const labelContainerElem = document.querySelector('#labels');

class StateDisplayHelper extends Component {
  constructor(gameObject, size) {
    super(gameObject);
    this.elem = document.createElement('div');
    labelContainerElem.appendChild(this.elem);
    this.pos = new THREE.Vector3();

    this.helper = new THREE.PolarGridHelper(size / 2, 1, 1, 16);
    gameObject.transform.add(this.helper);
  }
  setState(s) {
    this.elem.textContent = s;
  }
  setColor(cssColor) {
    this.elem.style.color = cssColor;
    this.helper.material.color.set(cssColor);
  }
  update() {
    const {pos} = this;
    const {transform} = this.gameObject;
    const {canvas} = globals;
    pos.copy(transform.position);

    // get the normalized screen coordinate of that position
    // x and y will be in the -1 to +1 range with x = -1 being
    // on the left and y = -1 being on the bottom
    pos.project(globals.camera);

    // convert the normalized position to CSS coordinates
    const x = (pos.x *  .5 + .5) * canvas.clientWidth;
    const y = (pos.y * -.5 + .5) * canvas.clientHeight;

    // move the elem to that position
    this.elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
  }
}
</pre>
<p>And we can then add them to the animals like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class Animal extends Component {
  constructor(gameObject, model) {
    super(gameObject);
+    this.helper = gameObject.addComponent(StateDisplayHelper, model.size);

     ...

  }
  update() {
    this.fsm.update();
+    const dir = THREE.MathUtils.radToDeg(this.gameObject.transform.rotation.y);
+    this.helper.setState(`${this.fsm.state}:${dir.toFixed(0)}`);
  }
}
</pre>
<p>While we're at it lets make it so we can turn them on/off using lil-gui like
we've used else where</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
+import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
</pre>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const gui = new GUI();
+gui.add(globals, 'debug').onChange(showHideDebugInfo);
+showHideDebugInfo();

const labelContainerElem = document.querySelector('#labels');
+function showHideDebugInfo() {
+  labelContainerElem.style.display = globals.debug ? '' : 'none';
+}
+showHideDebugInfo();

class StateDisplayHelper extends Component {

  ...

  update() {
+    this.helper.visible = globals.debug;
+    if (!globals.debug) {
+      return;
+    }

    ...
  }
}
</pre>
<p>And with that we get the kind of start of a game</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/game-conga-line.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/game-conga-line.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Originally I set out to make a <a href="https://www.google.com/search?q=snake+game">snake game</a>
where as you add animals to your line it gets harder because you need to avoid
crashing into them. I'd also have put some obstacles in the scene and maybe a fence or some
barrier around the perimeter.</p>
<p>Unfortunately the animals are long and thin. From above here's the zebra.</p>
<div class="threejs_center"><img src="../resources/images/zebra.png" style="width: 113px;"></div>

<p>The code so far is using circle collisions which means if we had obstacles like a fence
then this would be considered a collision</p>
<div class="threejs_center"><img src="../resources/images/zebra-collisions.svg" style="width: 400px;"></div>

<p>That's no good. Even animal to animal we'd have the same issue</p>
<p>I thought about writing a 2D rectangle to rectangle collision system but I
quickly realized it could really be a lot of code. Checking that 2 arbitrarily
oriented boxes overlap is not too much code and for our game with just a few
objects it might work but looking into it after a few objects you quickly start
needing to optimize the collision checking. First you might go through all
objects that can possibly collide with each other and check their bounding
spheres or bounding circles or their axially aligned bounding boxes. Once you
know which objects <em>might</em> be colliding then you need to do more work to check if
they are <em>actually</em> colliding. Often even checking the bounding spheres is too
much work and you need some kind of better spacial structure for the objects so
you can more quickly only check objects possibly near each other.</p>
<p>Then, once you write the code to check if 2 objects collide you generally want
to make a collision system rather than manually asking "do I collide with these
objects". A collision system emits events or calls callbacks in relation to
things colliding. The advantage is it can check all the collisions at once so no
objects get checked more than once where as if you manually call some "am I
colliding" function often objects will be checked more than once wasting time.</p>
<p>Making that collision system would probably not be more than 100-300 lines of
code for just checking arbitrarily oriented rectangles but it's still a ton more
code so it seemed best to leave it out.</p>
<p>Another solution would have been to try to find other characters that are
mostly circular from the top. Other humanoid characters for example instead
of animals in which case the circle checking might work animal to animal.
It would not work animal to fence, well we'd have to add circle to rectangle
checking. I thought about making the fence a fence of bushes or poles, something
circular but then I'd need probably 120 to 200 of them to surround the play area
which would run into the optimization issues mentioned above.</p>
<p>These are reasons many games use an existing solution. Often these solutions
are part of a physics library. The physical library needs to know if objects
collide with each other so on top of providing physics they can also be used
to detect collision.</p>
<p>If you're looking for a solution some of the three.js examples use
<a href="https://github.com/kripken/ammo.js/">ammo.js</a> so that might be one.</p>
<p>One other solution might have been to place the obstacles on a grid
and try to make it so each animal and the player just need to look at
the grid. While that would be performant I felt that's best left as an exercise
for the reader 😜</p>
<p>One more thing, many game systems have something called <a href="https://www.google.com/search?q=coroutines"><em>coroutines</em></a>.
Coroutines are routines that can pause while running and continue later.</p>
<p>Let's make the main character emit musical notes like they are leading
the line by singing. There are many ways we could implement this but for now
let's do it using coroutines.</p>
<p>First, here's a class to manage coroutines</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function* waitSeconds(duration) {
  while (duration &gt; 0) {
    duration -= globals.deltaTime;
    yield;
  }
}

class CoroutineRunner {
  constructor() {
    this.generatorStacks = [];
    this.addQueue = [];
    this.removeQueue = new Set();
  }
  isBusy() {
    return this.addQueue.length + this.generatorStacks.length &gt; 0;
  }
  add(generator, delay = 0) {
    const genStack = [generator];
    if (delay) {
      genStack.push(waitSeconds(delay));
    }
    this.addQueue.push(genStack);
  }
  remove(generator) {
    this.removeQueue.add(generator);
  }
  update() {
    this._addQueued();
    this._removeQueued();
    for (const genStack of this.generatorStacks) {
      const main = genStack[0];
      // Handle if one coroutine removes another
      if (this.removeQueue.has(main)) {
        continue;
      }
      while (genStack.length) {
        const topGen = genStack[genStack.length - 1];
        const {value, done} = topGen.next();
        if (done) {
          if (genStack.length === 1) {
            this.removeQueue.add(topGen);
            break;
          }
          genStack.pop();
        } else if (value) {
          genStack.push(value);
        } else {
          break;
        }
      }
    }
    this._removeQueued();
  }
  _addQueued() {
    if (this.addQueue.length) {
      this.generatorStacks.splice(this.generatorStacks.length, 0, ...this.addQueue);
      this.addQueue = [];
    }
  }
  _removeQueued() {
    if (this.removeQueue.size) {
      this.generatorStacks = this.generatorStacks.filter(genStack =&gt; !this.removeQueue.has(genStack[0]));
      this.removeQueue.clear();
    }
  }
}
</pre>
<p>It does things similar to <code class="notranslate" translate="no">SafeArray</code> to make sure that it's safe to add or remove
coroutines while other coroutines are running. It also handles nested coroutines.</p>
<p>To make a coroutine you make a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*">JavaScript generator function</a>.
A generator function is preceded by the keyword <code class="notranslate" translate="no">function*</code> (the asterisk is important!)</p>
<p>Generator functions can <code class="notranslate" translate="no">yield</code>. For example</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function* countOTo9() {
  for (let i = 0; i &lt; 10; ++i) {
    console.log(i);
    yield;
  }
}
</pre>
<p>If we added this function to the <code class="notranslate" translate="no">CoroutineRunner</code> above it would print
out each number, 0 to 9, once per frame or rather once per time we called <code class="notranslate" translate="no">runner.update</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const runner = new CoroutineRunner();
runner.add(count0To9);
while(runner.isBusy()) {
  runner.update();
}
</pre>
<p>Coroutines are removed automatically when they are finished.
To remove a coroutine early, before it reaches the end you need to keep
a reference to its generator like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const gen = count0To9();
runner.add(gen);

// sometime later

runner.remove(gen);
</pre>
<p>In any case, in the player let's use a coroutine to emit a note every half second to 1 second</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class Player extends Component {
  constructor(gameObject) {

    ...

+    this.runner = new CoroutineRunner();
+
+    function* emitNotes() {
+      for (;;) {
+        yield waitSeconds(rand(0.5, 1));
+        const noteGO = gameObjectManager.createGameObject(scene, 'note');
+        noteGO.transform.position.copy(gameObject.transform.position);
+        noteGO.transform.position.y += 5;
+        noteGO.addComponent(Note);
+      }
+    }
+
+    this.runner.add(emitNotes());
  }
  update() {
+    this.runner.update();

  ...

  }
}

function rand(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min;
}
</pre>
<p>You can see we make a <code class="notranslate" translate="no">CoroutineRunner</code> and we add an <code class="notranslate" translate="no">emitNotes</code> coroutine.
That function will run forever, waiting 0.5 to 1 seconds and then creating a game object
with a <code class="notranslate" translate="no">Note</code> component.</p>
<p>For the <code class="notranslate" translate="no">Note</code> component first lets make a texture with a note on it and
instead of loading a note image let's make one using a canvas like we covered in <a href="canvas-textures.html">the article on canvas textures</a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function makeTextTexture(str) {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.canvas.width = 64;
  ctx.canvas.height = 64;
  ctx.font = '60px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFF';
  ctx.fillText(str, ctx.canvas.width / 2, ctx.canvas.height / 2);
  return new THREE.CanvasTexture(ctx.canvas);
}
const noteTexture = makeTextTexture('♪');
</pre>
<p>The texture we create above is white each means when we use it
we can set the material's color and get a note of any color.</p>
<p>Now that we have a noteTexture here's the <code class="notranslate" translate="no">Note</code> component.
It uses <a href="/docs/#api/en/materials/SpriteMaterial"><code class="notranslate" translate="no">SpriteMaterial</code></a> and a <a href="/docs/#api/en/objects/Sprite"><code class="notranslate" translate="no">Sprite</code></a> like we covered in
<a href="billboards.html">the article on billboards</a> </p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class Note extends Component {
  constructor(gameObject) {
    super(gameObject);
    const {transform} = gameObject;
    const noteMaterial = new THREE.SpriteMaterial({
      color: new THREE.Color().setHSL(rand(1), 1, 0.5),
      map: noteTexture,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const note = new THREE.Sprite(noteMaterial);
    note.scale.setScalar(3);
    transform.add(note);
    this.runner = new CoroutineRunner();
    const direction = new THREE.Vector3(rand(-0.2, 0.2), 1, rand(-0.2, 0.2));

    function* moveAndRemove() {
      for (let i = 0; i &lt; 60; ++i) {
        transform.translateOnAxis(direction, globals.deltaTime * 10);
        noteMaterial.opacity = 1 - (i / 60);
        yield;
      }
      transform.parent.remove(transform);
      gameObjectManager.removeGameObject(gameObject);
    }

    this.runner.add(moveAndRemove());
  }
  update() {
    this.runner.update();
  }
}
</pre>
<p>All it does is setup a <a href="/docs/#api/en/objects/Sprite"><code class="notranslate" translate="no">Sprite</code></a>, then pick a random velocity and move
the transform at that velocity for 60 frames while fading out the note
by setting the material's <a href="/docs/#api/en/materials/Material#opacity"><code class="notranslate" translate="no">opacity</code></a>.
After the loop it the removes the transform
from the scene and the note itself from active gameobjects.</p>
<p>One last thing, let's add a few more animals</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function init() {

   ...

  const animalModelNames = [
    'pig',
    'cow',
    'llama',
    'pug',
    'sheep',
    'zebra',
    'horse',
  ];
+  const base = new THREE.Object3D();
+  const offset = new THREE.Object3D();
+  base.add(offset);
+
+  // position animals in a spiral.
+  const numAnimals = 28;
+  const arc = 10;
+  const b = 10 / (2 * Math.PI);
+  let r = 10;
+  let phi = r / b;
+  for (let i = 0; i &lt; numAnimals; ++i) {
+    const name = animalModelNames[rand(animalModelNames.length) | 0];
    const gameObject = gameObjectManager.createGameObject(scene, name);
    gameObject.addComponent(Animal, models[name]);
+    base.rotation.y = phi;
+    offset.position.x = r;
+    offset.updateWorldMatrix(true, false);
+    offset.getWorldPosition(gameObject.transform.position);
+    phi += arc / r;
+    r = b * phi;
  }
</pre>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/game-conga-line-w-notes.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/game-conga-line-w-notes.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>You might be asking, why not use <code class="notranslate" translate="no">setTimeout</code>? The problem with <code class="notranslate" translate="no">setTimeout</code>
is it's not related to the game clock. For example above we made the maximum
amount of time allowed to elapse between frames to be 1/20th of a second.
Our coroutine system will respect that limit but <code class="notranslate" translate="no">setTimeout</code> would not.</p>
<p>Of course we could have made a simple timer ourselves</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class Player ... {
  update() {
    this.noteTimer -= globals.deltaTime;
    if (this.noteTimer &lt;= 0) {
      // reset timer
      this.noteTimer = rand(0.5, 1);
      // create a gameobject with a note component
    }
  }
</pre>
<p>And for this particular case that might have been better but as you add
more and things you'll get more and more variables added to your classes
where as with coroutines you can often just <em>fire and forget</em>.</p>
<p>Given our animal's simple states we could also have implemented them
with a coroutine in the form of</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// pseudo code!
function* animalCoroutine() {
   setAnimation('Idle');
   while(playerIsTooFar()) {
     yield;
   }
   const target = endOfLine;
   setAnimation('Jump');
   while(targetIsTooFar()) {
     aimAt(target);
     yield;
   }
   setAnimation('Walk')
   while(notAtOldestPositionOfTarget()) {
     addHistory();
     aimAt(target);
     yield;
   }
   for(;;) {
     addHistory();
     const pos = history.unshift();
     transform.position.copy(pos);
     aimAt(history[0]);
     yield;
   }
}
</pre>
<p>This would have worked but of course as soon as our states were not so linear
we'd have had to switch to a <code class="notranslate" translate="no">FiniteStateMachine</code>.</p>
<p>It also wasn't clear to me if coroutines should run independently of their
components. We could have made a global <code class="notranslate" translate="no">CoroutineRunner</code> and put all
coroutines on it. That would make cleaning them up harder. As it is now
if the gameobject is removed all of its components are removed and
therefore the coroutine runners created are no longer called and it will
all get garbage collected. If we had global runner then it would be
the responsibility of each component to remove any coroutines it added
or else some other mechanism of registering coroutines with a particular
component or gameobject would be needed so that removing one removes the
others.</p>
<p>There are lots more issues a
normal game engine would deal with. As it is there is no order to how
gameobjects or their components are run. They are just run in the order added.
Many game systems add a priority so the order can be set or changed.</p>
<p>Another issue we ran into is the <code class="notranslate" translate="no">Note</code> removing its gameobject's transform from the scene.
That seems like something that should happen in <code class="notranslate" translate="no">GameObject</code> since it was <code class="notranslate" translate="no">GameObject</code>
that added the transform in the first place. Maybe <code class="notranslate" translate="no">GameObject</code> should have
a <code class="notranslate" translate="no">dispose</code> method that is called by <code class="notranslate" translate="no">GameObjectManager.removeGameObject</code>?</p>
<p>Yet another is how we're manually calling <code class="notranslate" translate="no">gameObjectManager.update</code> and <code class="notranslate" translate="no">inputManager.update</code>.
Maybe there should be a <code class="notranslate" translate="no">SystemManager</code> which these global services can add themselves
and each service will have its <code class="notranslate" translate="no">update</code> function called. In this way if we added a new
service like <code class="notranslate" translate="no">CollisionManager</code> we could just add it to the system manager and not
have to edit the render loop.</p>
<p>I'll leave those kinds of issues up to you.
I hope this article has given you some ideas for your own game engine.</p>
<p>Maybe I should promote a game jam. If you click the <em>jsfiddle</em> or <em>codepen</em> buttons
above the last example they'll open in those sites ready to edit. Add some features,
Change the game to a pug leading a bunch of knights. Use the knight's rolling animation
as a bowling ball and make an animal bowling game. Make an animal relay race.
If you make a cool game post a link in the comments below.</p>
<div class="footnotes">
[<a id="parented">1</a>]: technically it would still work if none of the parents have any translation, rotation, or scale <a href="#parented-backref">§</a>.
</div>
        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# indexed-textures.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Indexed Textures for Picking and Color</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Indexed Textures for Picking and Color">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Indexed Textures for Picking and Color</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This article is a continuation of <a href="align-html-elements-to-3d.html">an article about aligning html elements to 3d</a>.
If you haven't read that yet you should start there before continuing here.</p>
<p>Sometimes using three.js requires coming up with creative solutions.
I'm not sure this is a great solution but I thought I'd share it and
you can see if it suggests any solutions for your needs.</p>
<p>In the <a href="align-html-elements-to-3d.html">previous article</a> we
displayed country names around a 3d globe. How would we go about letting
the user select a country and show their selection?</p>
<p>The first idea that comes to mind is to generate geometry for each country.
We could <a href="picking.html">use a picking solution</a> like we covered before.
We'd build 3D geometry for each country. If the user clicks on the mesh for
that country we'd know what country was clicked.</p>
<p>So, just to check that solution I tried generating 3D meshes of all the countries
using the same data I used to generate the outlines
<a href="align-html-elements-to-3d.html">in the previous article</a>.
The result was a 15.5meg binary GLTF (.glb) file. Making the user download 15.5meg
sounds like too much to me.</p>
<p>There are lots of ways to compress the data. The first would probably be
to apply some algorithm to lower the resolution of the outlines. I didn't spend
any time pursuing that solution. For borders of the USA that's probably a huge
win. For a borders of Canada probably much less. </p>
<p>Another solution would be to use just actual data compression. For example gzipping
the file brought it down to 11meg. That's 30% less but arguably not enough.</p>
<p>We could store all the data as 16bit ranged values instead of 32bit float values.
Or we could use something like <a href="https://google.github.io/draco/">draco compression</a>
and maybe that would be enough. I didn't check and I would encourage you to check
yourself and tell me how it goes as I'd love to know. 😅</p>
<p>In my case I thought about <a href="picking.html">the GPU picking solution</a>
we covered at the end of <a href="picking.html">the article on picking</a>. In
that solution we drew every mesh with a unique color that represented that
mesh's id. We then drew all the meshes and looked at the color that was clicked
on.</p>
<p>Taking inspiration from that we could pre-generate a map of countries where
each country's color is its index number in our array of countries. We could
then use a similar GPU picking technique. We'd draw the globe off screen using
this index texture. Looking at the color of the pixel the user clicks would
tell us the country id.</p>
<p>So, I <a href="https://github.com/mrdoob/three.js/blob/master/manual/resources/tools/geo-picking/">wrote some code</a>
to generate such a texture. Here it is. </p>
<div class="threejs_center"><img src="../examples/resources/data/world/country-index-texture.png" style="width: 700px;"></div>

<p>Note: The data used to generate this texture comes from <a href="http://thematicmapping.org/downloads/world_borders.php">this website</a>
and is therefore licensed as <a href="http://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>.</p>
<p>It's only 217k, much better than the 14meg for the country meshes. In fact we could probably
even lower the resolution but 217k seems good enough for now.</p>
<p>So let's try using it for picking countries.</p>
<p>Grabbing code from the <a href="picking.html">gpu picking example</a> we need
a scene for picking.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const pickingScene = new THREE.Scene();
pickingScene.background = new THREE.Color(0);
</pre>
<p>and we need to add the globe with the our index texture to the
picking scene.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const loader = new THREE.TextureLoader();
  const geometry = new THREE.SphereGeometry(1, 64, 32);

+  const indexTexture = loader.load('resources/data/world/country-index-texture.png', render);
+  indexTexture.minFilter = THREE.NearestFilter;
+  indexTexture.magFilter = THREE.NearestFilter;
+
+  const pickingMaterial = new THREE.MeshBasicMaterial({map: indexTexture});
+  pickingScene.add(new THREE.Mesh(geometry, pickingMaterial));

  const texture = loader.load('resources/data/world/country-outlines-4k.png', render);
  const material = new THREE.MeshBasicMaterial({map: texture});
  scene.add(new THREE.Mesh(geometry, material));
}
</pre>
<p>Then let's copy over the <code class="notranslate" translate="no">GPUPickingHelper</code> class we used
before with a few minor changes.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class GPUPickHelper {
  constructor() {
    // create a 1x1 pixel render target
    this.pickingTexture = new THREE.WebGLRenderTarget(1, 1);
    this.pixelBuffer = new Uint8Array(4);
-    this.pickedObject = null;
-    this.pickedObjectSavedColor = 0;
  }
  pick(cssPosition, scene, camera) {
    const {pickingTexture, pixelBuffer} = this;

    // set the view offset to represent just a single pixel under the mouse
    const pixelRatio = renderer.getPixelRatio();
    camera.setViewOffset(
        renderer.getContext().drawingBufferWidth,   // full width
        renderer.getContext().drawingBufferHeight,  // full top
        cssPosition.x * pixelRatio | 0,             // rect x
        cssPosition.y * pixelRatio | 0,             // rect y
        1,                                          // rect width
        1,                                          // rect height
    );
    // render the scene
    renderer.setRenderTarget(pickingTexture);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    // clear the view offset so rendering returns to normal
    camera.clearViewOffset();
    //read the pixel
    renderer.readRenderTargetPixels(
        pickingTexture,
        0,   // x
        0,   // y
        1,   // width
        1,   // height
        pixelBuffer);

+    const id =
+        (pixelBuffer[0] &lt;&lt; 16) |
+        (pixelBuffer[1] &lt;&lt;  8) |
+        (pixelBuffer[2] &lt;&lt;  0);
+
+    return id;
-    const id =
-        (pixelBuffer[0] &lt;&lt; 16) |
-        (pixelBuffer[1] &lt;&lt;  8) |
-        (pixelBuffer[2]      );
-    const intersectedObject = idToObject[id];
-    if (intersectedObject) {
-      // pick the first object. It's the closest one
-      this.pickedObject = intersectedObject;
-      // save its color
-      this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
-      // set its emissive color to flashing red/yellow
-      this.pickedObject.material.emissive.setHex((time * 8) % 2 &gt; 1 ? 0xFFFF00 : 0xFF0000);
-    }
  }
}
</pre>
<p>Now we can use that to pick countries.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const pickHelper = new GPUPickHelper();

function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
  };
}

function pickCountry(event) {
  // exit if we have not loaded the data yet
  if (!countryInfos) {
    return;
  }

  const position = getCanvasRelativePosition(event);
  const id = pickHelper.pick(position, pickingScene, camera);
  if (id &gt; 0) {
    // we clicked a country. Toggle its 'selected' property
    const countryInfo = countryInfos[id - 1];
    const selected = !countryInfo.selected;
    // if we're selecting this country and modifiers are not
    // pressed unselect everything else.
    if (selected &amp;&amp; !event.shiftKey &amp;&amp; !event.ctrlKey &amp;&amp; !event.metaKey) {
      unselectAllCountries();
    }
    numCountriesSelected += selected ? 1 : -1;
    countryInfo.selected = selected;
  } else if (numCountriesSelected) {
    // the ocean or sky was clicked
    unselectAllCountries();
  }
  requestRenderIfNotRequested();
}

function unselectAllCountries() {
  numCountriesSelected = 0;
  countryInfos.forEach((countryInfo) =&gt; {
    countryInfo.selected = false;
  });
}

canvas.addEventListener('pointerup', pickCountry);
</pre>
<p>The code above sets/unsets the <code class="notranslate" translate="no">selected</code> property on
the array of countries. If <code class="notranslate" translate="no">shift</code> or <code class="notranslate" translate="no">ctrl</code> or <code class="notranslate" translate="no">cmd</code>
is pressed then you can select more than one country.</p>
<p>All that's left is showing the selected countries. For now
let's just update the labels.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function updateLabels() {
  // exit if we have not loaded the data yet
  if (!countryInfos) {
    return;
  }

  const large = settings.minArea * settings.minArea;
  // get a matrix that represents a relative orientation of the camera
  normalMatrix.getNormalMatrix(camera.matrixWorldInverse);
  // get the camera's position
  camera.getWorldPosition(cameraPosition);
  for (const countryInfo of countryInfos) {
-    const {position, elem, area} = countryInfo;
-    // large enough?
-    if (area &lt; large) {
+    const {position, elem, area, selected} = countryInfo;
+    const largeEnough = area &gt;= large;
+    const show = selected || (numCountriesSelected === 0 &amp;&amp; largeEnough);
+    if (!show) {
      elem.style.display = 'none';
      continue;
    }

    ...
</pre>
<p>and with that we should be able to pick countries</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/indexed-textures-picking.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/indexed-textures-picking.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>The code stills shows countries based on their area but if you
click one just that one will have a label.</p>
<p>So that seems like a reasonable solution for picking countries
but what about highlighting the selected countries?</p>
<p>For that we can take inspiration from <em>paletted graphics</em>.</p>
<p><a href="https://en.wikipedia.org/wiki/Palette_%28computing%29">Paletted graphics</a>
or <a href="https://en.wikipedia.org/wiki/Indexed_color">Indexed Color</a> is
what older systems like the Atari 800, Amiga, NES,
Super Nintendo, and even older IBM PCs used. Instead of storing bitmaps
as RGBA colors 8bits per color, 32 bytes per pixel or more, they stored
bitmaps as 8bit values or less. The value for each pixel was an index
into a palette. So for example a value
of 3 in the image means "display color 3". What color color#3 is is
defined somewhere else called a "palette".</p>
<p>In JavaScript you can think of it like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const face7x7PixelImageData = [
  0, 1, 1, 1, 1, 1, 0,
  1, 0, 0, 0, 0, 0, 1,
  1, 0, 2, 0, 2, 0, 1,
  1, 0, 0, 0, 0, 0, 1,
  1, 0, 3, 3, 3, 0, 1,
  1, 0, 0, 0, 0, 0, 1,
  0, 1, 1, 1, 1, 1, 1,
];

const palette = [
  [255, 255, 255],  // white
  [  0,   0,   0],  // black
  [  0, 255, 255],  // cyan
  [255,   0,   0],  // red
];
</pre>
<p>Where each pixel in the image data is an index into palette. If you interpreted
the image data through the palette above you'd get this image</p>
<div class="threejs_center"><img src="../resources/images/7x7-indexed-face.png"></div>

<p>In our case we already have a texture above that has a different id
per country. So, we could use that same texture through a palette
texture to give each country its own color. By changing the palette
texture we can color each individual country. For example by setting
the entire palette texture to black and then for one country's entry
in the palette a different color, we can highlight just that country.</p>
<p>To do paletted index graphics requires some custom shader code.
Let's modify the default shaders in three.js.
That way we can use lighting and other features if we want.</p>
<p>Like we covered in <a href="optimize-lots-of-objects-animated.html">the article on animating lots of objects</a>
we can modify the default shaders by adding a function to a material's
<code class="notranslate" translate="no">onBeforeCompile</code> property.</p>
<p>The default fragment shader looks something like this before compiling.</p>
<pre class="prettyprint showlinemods notranslate lang-glsl" translate="no">#include &lt;common&gt;
#include &lt;color_pars_fragment&gt;
#include &lt;uv_pars_fragment&gt;
#include &lt;map_pars_fragment&gt;
#include &lt;alphamap_pars_fragment&gt;
#include &lt;aomap_pars_fragment&gt;
#include &lt;lightmap_pars_fragment&gt;
#include &lt;envmap_pars_fragment&gt;
#include &lt;fog_pars_fragment&gt;
#include &lt;specularmap_pars_fragment&gt;
#include &lt;logdepthbuf_pars_fragment&gt;
#include &lt;clipping_planes_pars_fragment&gt;
void main() {
    #include &lt;clipping_planes_fragment&gt;
    vec4 diffuseColor = vec4( diffuse, opacity );
    #include &lt;logdepthbuf_fragment&gt;
    #include &lt;map_fragment&gt;
    #include &lt;color_fragment&gt;
    #include &lt;alphamap_fragment&gt;
    #include &lt;alphatest_fragment&gt;
    #include &lt;specularmap_fragment&gt;
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    #ifdef USE_LIGHTMAP
        reflectedLight.indirectDiffuse += texture2D( lightMap, vLightMapUv ).xyz * lightMapIntensity;
    #else
        reflectedLight.indirectDiffuse += vec3( 1.0 );
    #endif
    #include &lt;aomap_fragment&gt;
    reflectedLight.indirectDiffuse *= diffuseColor.rgb;
    vec3 outgoingLight = reflectedLight.indirectDiffuse;
    #include &lt;envmap_fragment&gt;
    gl_FragColor = vec4( outgoingLight, diffuseColor.a );
    #include &lt;premultiplied_alpha_fragment&gt;
    #include &lt;tonemapping_fragment&gt;
    #include &lt;colorspace_fragment&gt;
    #include &lt;fog_fragment&gt;
}
</pre>
<p><a href="https://github.com/mrdoob/three.js/tree/dev/src/renderers/shaders/ShaderChunk">Digging through all those snippets</a>
we find that three.js uses a variable called <code class="notranslate" translate="no">diffuseColor</code> to manage the
base material color. It sets this in the <code class="notranslate" translate="no">&lt;color_fragment&gt;</code> <a href="https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/color_fragment.glsl.js">snippet</a>
so we should be able to modify it after that point.</p>
<p><code class="notranslate" translate="no">diffuseColor</code> at that point in the shader should already be the color from
our outline texture so we can look up the color from a palette texture
and mix them for the final result.</p>
<p>Like we <a href="optimize-lots-of-objects-animated.html">did before</a> we'll make an array
of search and replacement strings and apply them to the shader in
<a href="/docs/#api/en/materials/Material.onBeforeCompile"><code class="notranslate" translate="no">Material.onBeforeCompile</code></a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const loader = new THREE.TextureLoader();
  const geometry = new THREE.SphereGeometry(1, 64, 32);

  const indexTexture = loader.load('resources/data/world/country-index-texture.png', render);
  indexTexture.minFilter = THREE.NearestFilter;
  indexTexture.magFilter = THREE.NearestFilter;

  const pickingMaterial = new THREE.MeshBasicMaterial({map: indexTexture});
  pickingScene.add(new THREE.Mesh(geometry, pickingMaterial));

+  const fragmentShaderReplacements = [
+    {
+      from: '#include &lt;common&gt;',
+      to: `
+        #include &lt;common&gt;
+        uniform sampler2D indexTexture;
+        uniform sampler2D paletteTexture;
+        uniform float paletteTextureWidth;
+      `,
+    },
+    {
+      from: '#include &lt;color_fragment&gt;',
+      to: `
+        #include &lt;color_fragment&gt;
+        {
+          vec4 indexColor = texture2D(indexTexture, vUv);
+          float index = indexColor.r * 255.0 + indexColor.g * 255.0 * 256.0;
+          vec2 paletteUV = vec2((index + 0.5) / paletteTextureWidth, 0.5);
+          vec4 paletteColor = texture2D(paletteTexture, paletteUV);
+          // diffuseColor.rgb += paletteColor.rgb;   // white outlines
+          diffuseColor.rgb = paletteColor.rgb - diffuseColor.rgb;  // black outlines
+        }
+      `,
+    },
+  ];

  const texture = loader.load('resources/data/world/country-outlines-4k.png', render);
  const material = new THREE.MeshBasicMaterial({map: texture});
+  material.onBeforeCompile = function(shader) {
+    fragmentShaderReplacements.forEach((rep) =&gt; {
+      shader.fragmentShader = shader.fragmentShader.replace(rep.from, rep.to);
+    });
+  };
  scene.add(new THREE.Mesh(geometry, material));
}
</pre>
<p>Above can see above we add 3 uniforms, <code class="notranslate" translate="no">indexTexture</code>, <code class="notranslate" translate="no">paletteTexture</code>,
and <code class="notranslate" translate="no">paletteTextureWidth</code>. We get a color from the <code class="notranslate" translate="no">indexTexture</code>
and convert it to an index. <code class="notranslate" translate="no">vUv</code> is the texture coordinates provided by
three.js. We then use that index to get a color out of the palette texture.
We then mix the result with the current <code class="notranslate" translate="no">diffuseColor</code>. The <code class="notranslate" translate="no">diffuseColor</code>
at this point is our black and white outline texture so if we add the 2 colors
we'll get white outlines. If we subtract the current diffuse color we'll get
black outlines.</p>
<p>Before we can render we need to setup the palette texture
and these 3 uniforms.</p>
<p>For the palette texture it just needs to be wide enough to
hold one color per country + one for the ocean (id = 0).
There are 240 something countries. We could wait until the
list of countries loads to get an exact number or look it up.
There's not much harm in just picking some larger number so
let's choose 512.</p>
<p>Here's the code to create the palette texture</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const maxNumCountries = 512;
const paletteTextureWidth = maxNumCountries;
const paletteTextureHeight = 1;
const palette = new Uint8Array(paletteTextureWidth * 4);
const paletteTexture = new THREE.DataTexture(
    palette, paletteTextureWidth, paletteTextureHeight);
paletteTexture.minFilter = THREE.NearestFilter;
paletteTexture.magFilter = THREE.NearestFilter;
</pre>
<p>A <a href="/docs/#api/en/textures/DataTexture"><code class="notranslate" translate="no">DataTexture</code></a> let's us give a texture raw data. In this case
we're giving it 512 RGBA colors, 4 bytes each where each byte is
red, green, and blue respectively using values that go from 0 to 255.</p>
<p>Let's fill it with random colors just to see it work</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">for (let i = 1; i &lt; palette.length; ++i) {
  palette[i] = Math.random() * 256;
}
// set the ocean color (index #0)
palette.set([100, 200, 255, 255], 0);
paletteTexture.needsUpdate = true;
</pre>
<p>Anytime we want three.js to update the palette texture with
the contents of the <code class="notranslate" translate="no">palette</code> array we need to set <code class="notranslate" translate="no">paletteTexture.needsUpdate</code>
to <code class="notranslate" translate="no">true</code>.</p>
<p>And then we still need to set the uniforms on the material.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const geometry = new THREE.SphereGeometry(1, 64, 32);
const material = new THREE.MeshBasicMaterial({map: texture});
material.onBeforeCompile = function(shader) {
  fragmentShaderReplacements.forEach((rep) =&gt; {
    shader.fragmentShader = shader.fragmentShader.replace(rep.from, rep.to);
  });
+  shader.uniforms.paletteTexture = {value: paletteTexture};
+  shader.uniforms.indexTexture = {value: indexTexture};
+  shader.uniforms.paletteTextureWidth = {value: paletteTextureWidth};
};
scene.add(new THREE.Mesh(geometry, material));
</pre>
<p>and with that we get randomly colored countries.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/indexed-textures-random-colors.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/indexed-textures-random-colors.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Now that we can see the index and palette textures are working
let's manipulate the palette for highlighting.</p>
<p>First let's make function that will let us pass in a three.js
style color and give us values we can put in the palette texture.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const tempColor = new THREE.Color();
function get255BasedColor(color) {
  tempColor.set(color);
  const base = tempColor.toArray().map(v =&gt; v * 255);
  base.push(255); // alpha
  return base;
}
</pre>
<p>Calling it like this <code class="notranslate" translate="no">color = get255BasedColor('red')</code> will
return an array like <code class="notranslate" translate="no">[255, 0, 0, 255]</code>.</p>
<p>Next let's use it to make a few colors and fill out the
palette.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const selectedColor = get255BasedColor('red');
const unselectedColor = get255BasedColor('#444');
const oceanColor = get255BasedColor('rgb(100,200,255)');
resetPalette();

function setPaletteColor(index, color) {
  palette.set(color, index * 4);
}

function resetPalette() {
  // make all colors the unselected color
  for (let i = 1; i &lt; maxNumCountries; ++i) {
    setPaletteColor(i, unselectedColor);
  }

  // set the ocean color (index #0)
  setPaletteColor(0, oceanColor);
  paletteTexture.needsUpdate = true;
}
</pre>
<p>Now let's use those functions to update the palette when a country
is selected</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
  };
}

function pickCountry(event) {
  // exit if we have not loaded the data yet
  if (!countryInfos) {
    return;
  }

  const position = getCanvasRelativePosition(event);
  const id = pickHelper.pick(position, pickingScene, camera);
  if (id &gt; 0) {
    const countryInfo = countryInfos[id - 1];
    const selected = !countryInfo.selected;
    if (selected &amp;&amp; !event.shiftKey &amp;&amp; !event.ctrlKey &amp;&amp; !event.metaKey) {
      unselectAllCountries();
    }
    numCountriesSelected += selected ? 1 : -1;
    countryInfo.selected = selected;
+    setPaletteColor(id, selected ? selectedColor : unselectedColor);
+    paletteTexture.needsUpdate = true;
  } else if (numCountriesSelected) {
    unselectAllCountries();
  }
  requestRenderIfNotRequested();
}

function unselectAllCountries() {
  numCountriesSelected = 0;
  countryInfos.forEach((countryInfo) =&gt; {
    countryInfo.selected = false;
  });
+  resetPalette();
}
</pre>
<p>and we that we should be able to highlight 1 or more countries.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/indexed-textures-picking-and-highlighting.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/indexed-textures-picking-and-highlighting.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>That seems to work!</p>
<p>One minor thing is we can't spin the globe without changing
the selection state. If we select a country and then want to
rotate the globe the selection will change.</p>
<p>Let's try to fix that. Off the top of my head we can check 2 things.
How much time passed between clicking and letting go.
Another is did the user actually move the mouse. If the
time is short or if they didn't move the mouse then it
was probably a click. Otherwise they were probably trying
to drag the globe.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const maxClickTimeMs = 200;
+const maxMoveDeltaSq = 5 * 5;
+const startPosition = {};
+let startTimeMs;
+
+function recordStartTimeAndPosition(event) {
+  startTimeMs = performance.now();
+  const pos = getCanvasRelativePosition(event);
+  startPosition.x = pos.x;
+  startPosition.y = pos.y;
+}

function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
  };
}

function pickCountry(event) {
  // exit if we have not loaded the data yet
  if (!countryInfos) {
    return;
  }

+  // if it's been a moment since the user started
+  // then assume it was a drag action, not a select action
+  const clickTimeMs = performance.now() - startTimeMs;
+  if (clickTimeMs &gt; maxClickTimeMs) {
+    return;
+  }
+
+  // if they moved assume it was a drag action
+  const position = getCanvasRelativePosition(event);
+  const moveDeltaSq = (startPosition.x - position.x) ** 2 +
+                      (startPosition.y - position.y) ** 2;
+  if (moveDeltaSq &gt; maxMoveDeltaSq) {
+    return;
+  }

-  const position = {x: event.clientX, y: event.clientY};
  const id = pickHelper.pick(position, pickingScene, camera);
  if (id &gt; 0) {
    const countryInfo = countryInfos[id - 1];
    const selected = !countryInfo.selected;
    if (selected &amp;&amp; !event.shiftKey &amp;&amp; !event.ctrlKey &amp;&amp; !event.metaKey) {
      unselectAllCountries();
    }
    numCountriesSelected += selected ? 1 : -1;
    countryInfo.selected = selected;
    setPaletteColor(id, selected ? selectedColor : unselectedColor);
    paletteTexture.needsUpdate = true;
  } else if (numCountriesSelected) {
    unselectAllCountries();
  }
  requestRenderIfNotRequested();
}

function unselectAllCountries() {
  numCountriesSelected = 0;
  countryInfos.forEach((countryInfo) =&gt; {
    countryInfo.selected = false;
  });
  resetPalette();
}

+canvas.addEventListener('pointerdown', recordStartTimeAndPosition);
canvas.addEventListener('pointerup', pickCountry);
</pre>
<p>and with those changes it <em>seems</em> like it works to me.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/indexed-textures-picking-debounced.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/indexed-textures-picking-debounced.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>I'm not a UX expert so I'd love to hear if there is a better
solution.</p>
<p>I hope that gave you some idea of how indexed graphics can be useful
and how you can modify the shaders three.js makes to add simple features.
How to use GLSL, the language the shaders are written in, is too much for
this article. There are a few links to some info in
<a href="post-processing.html">the article on post processing</a>.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>


# lights.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Lights</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Lights">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Lights</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This article is part of a series of articles about three.js. The
first article is <a href="fundamentals.html">three.js fundamentals</a>. If
you haven't read that yet and you're new to three.js you might want to
consider starting there and also the article on <a href="setup.html">setting up your environment</a>. The
<a href="textures.html">previous article was about textures</a>.</p>
<p>Let's go over how to use the various kinds of lights in three.</p>
<p>Starting with one of our previous samples let's update the camera.
We'll set the field of view to 45 degrees, the far plane to 100 units,
and we'll move the camera 10 units up and 20 units back from the origin</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">*const fov = 45;
const aspect = 2;  // the canvas default
const near = 0.1;
*const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
+camera.position.set(0, 10, 20);
</pre>
<p>Next let's add <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a>. <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> let the user spin
or <em>orbit</em> the camera around some point. The <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> are
an optional feature of three.js so first we need to include them
in our page</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import * as THREE from 'three';
+import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
</pre>
<p>Then we can use them. We pass the <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> a camera to
control and the DOM element to use to get input events</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);
controls.update();
</pre>
<p>We also set the target to orbit around to 5 units above the origin
and then call <code class="notranslate" translate="no">controls.update</code> so the controls will use the new
target.</p>
<p>Next up let's make some things to light up. First we'll make ground
plane. We'll apply a tiny 2x2 pixel checkerboard texture that looks
like this</p>
<div class="threejs_center">
  <img src="../examples/resources/images/checker.png" class="border" style="
    image-rendering: pixelated;
    width: 128px;
  ">
</div>

<p>First we load the texture, set it to repeating, set the filtering to
nearest, and set how many times we want it to repeat. Since the
texture is a 2x2 pixel checkerboard, by repeating and setting the
repeat to half the size of the plane each check on the checkerboard
will be exactly 1 unit large;</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const planeSize = 40;

const loader = new THREE.TextureLoader();
const texture = loader.load('resources/images/checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
texture.colorSpace = THREE.SRGBColorSpace;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);
</pre>
<p>We then make a plane geometry, a material for the plane, and a mesh
to insert it in the scene. Planes default to being in the XY plane
but the ground is in the XZ plane so we rotate it.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
scene.add(mesh);
</pre>
<p>Let's add a cube and a sphere so we have 3 things to light including the plane</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const cubeSize = 4;
  const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
  const mesh = new THREE.Mesh(cubeGeo, cubeMat);
  mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
  scene.add(mesh);
}
{
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
  scene.add(mesh);
}
</pre>
<p>Now that we have a scene to light up let's add lights!</p>
<h2 id="-ambientlight-"><a href="/docs/#api/en/lights/AmbientLight"><code class="notranslate" translate="no">AmbientLight</code></a></h2>
<p>First let's make an <a href="/docs/#api/en/lights/AmbientLight"><code class="notranslate" translate="no">AmbientLight</code></a></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);
</pre>
<p>Let's also make it so we can adjust the light's parameters.
We'll use <a href="https://github.com/georgealways/lil-gui">lil-gui</a> again.
To be able to adjust the color via lil-gui we need a small helper
that presents a property to lil-gui that looks like a CSS hex color string
(eg: <code class="notranslate" translate="no">#FF8844</code>). Our helper will get the color from a named property,
convert it to a hex string to offer to lil-gui. When lil-gui tries
to set the helper's property we'll assign the result back to the light's
color.</p>
<p>Here's the helper:</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}
</pre>
<p>And here's our code setting up lil-gui</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const gui = new GUI();
gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
gui.add(light, 'intensity', 0, 2, 0.01);
</pre>
<p>And here's the result</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/lights-ambient.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/lights-ambient.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Click and drag in the scene to <em>orbit</em> the camera.</p>
<p>Notice there is no definition. The shapes are flat. The <a href="/docs/#api/en/lights/AmbientLight"><code class="notranslate" translate="no">AmbientLight</code></a> effectively
just multiplies the material's color by the light's color times the
intensity.</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">color = materialColor * light.color * light.intensity;
</pre><p>That's it. It has no direction.
This style of ambient lighting is actually not all that
useful as lighting as it's 100% even so other than changing the color
of everything in the scene it doesn't look much like <em>lighting</em>.
What it does help with is making the darks not too dark.</p>
<h2 id="-hemispherelight-"><a href="/docs/#api/en/lights/HemisphereLight"><code class="notranslate" translate="no">HemisphereLight</code></a></h2>
<p>Let's switch the code to a <a href="/docs/#api/en/lights/HemisphereLight"><code class="notranslate" translate="no">HemisphereLight</code></a>. A <a href="/docs/#api/en/lights/HemisphereLight"><code class="notranslate" translate="no">HemisphereLight</code></a>
takes a sky color and a ground color and just multiplies the
material's color between those 2 colors—the sky color if the
surface of the object is pointing up and the ground color if
the surface of the object is pointing down.</p>
<p>Here's the new code</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-const color = 0xFFFFFF;
+const skyColor = 0xB1E1FF;  // light blue
+const groundColor = 0xB97A20;  // brownish orange
const intensity = 1;
-const light = new THREE.AmbientLight(color, intensity);
+const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(light);
</pre>
<p>Let's also update the lil-gui code to edit both colors</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const gui = new GUI();
-gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
+gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor');
+gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor');
gui.add(light, 'intensity', 0, 2, 0.01);
</pre>
<p>The result:</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/lights-hemisphere.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/lights-hemisphere.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Notice again there is almost no definition, everything looks kind
of flat. The <a href="/docs/#api/en/lights/HemisphereLight"><code class="notranslate" translate="no">HemisphereLight</code></a> used in combination with another light
can help give a nice kind of influence of the color of the sky
and ground. In that way it's best used in combination with some
other light or a substitute for an <a href="/docs/#api/en/lights/AmbientLight"><code class="notranslate" translate="no">AmbientLight</code></a>.</p>
<h2 id="-directionallight-"><a href="/docs/#api/en/lights/DirectionalLight"><code class="notranslate" translate="no">DirectionalLight</code></a></h2>
<p>Let's switch the code to a <a href="/docs/#api/en/lights/DirectionalLight"><code class="notranslate" translate="no">DirectionalLight</code></a>.
A <a href="/docs/#api/en/lights/DirectionalLight"><code class="notranslate" translate="no">DirectionalLight</code></a> is often used to represent the sun.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(0, 10, 0);
light.target.position.set(-5, 0, 0);
scene.add(light);
scene.add(light.target);
</pre>
<p>Notice that we had to add the <code class="notranslate" translate="no">light</code> and the <code class="notranslate" translate="no">light.target</code>
to the scene. A three.js <a href="/docs/#api/en/lights/DirectionalLight"><code class="notranslate" translate="no">DirectionalLight</code></a> will shine
in the direction of its target.</p>
<p>Let's make it so we can move the target by adding it to
our GUI.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const gui = new GUI();
gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
gui.add(light, 'intensity', 0, 2, 0.01);
gui.add(light.target.position, 'x', -10, 10);
gui.add(light.target.position, 'z', -10, 10);
gui.add(light.target.position, 'y', 0, 10);
</pre>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/lights-directional.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/lights-directional.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>It's kind of hard to see what's going on. Three.js has a bunch
of helper objects we can add to our scene to help visualize
invisible parts of a scene. In this case we'll use the
<a href="/docs/#api/en/helpers/DirectionalLightHelper"><code class="notranslate" translate="no">DirectionalLightHelper</code></a> which will draw a plane, to represent
the light, and a line from the light to the target. We just
pass it the light and add it to the scene.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const helper = new THREE.DirectionalLightHelper(light);
scene.add(helper);
</pre>
<p>While we're at it let's make it so we can set both the position
of the light and the target. To do this we'll make a function
that given a <a href="/docs/#api/en/math/Vector3"><code class="notranslate" translate="no">Vector3</code></a> will adjust its <code class="notranslate" translate="no">x</code>, <code class="notranslate" translate="no">y</code>, and <code class="notranslate" translate="no">z</code> properties
using <code class="notranslate" translate="no">lil-gui</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name);
  folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
  folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
  folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
  folder.open();
}
</pre>
<p>Note that we need to call the helper's <code class="notranslate" translate="no">update</code> function
anytime we change something so the helper knows to update
itself. As such we pass in an <code class="notranslate" translate="no">onChangeFn</code> function to
get called anytime lil-gui updates a value.</p>
<p>Then we can use that for both the light's position
and the target's position like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+function updateLight() {
+  light.target.updateMatrixWorld();
+  helper.update();
+}
+updateLight();

const gui = new GUI();
gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
gui.add(light, 'intensity', 0, 2, 0.01);

+makeXYZGUI(gui, light.position, 'position', updateLight);
+makeXYZGUI(gui, light.target.position, 'target', updateLight);
</pre>
<p>Now we can move the light, and its target</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/lights-directional-w-helper.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/lights-directional-w-helper.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Orbit the camera and it gets easier to see. The plane
represents a <a href="/docs/#api/en/lights/DirectionalLight"><code class="notranslate" translate="no">DirectionalLight</code></a> because a directional
light computes light coming in one direction. There is no
<em>point</em> the light comes from, it's an infinite plane of light
shooting out parallel rays of light.</p>
<h2 id="-pointlight-"><a href="/docs/#api/en/lights/PointLight"><code class="notranslate" translate="no">PointLight</code></a></h2>
<p>A <a href="/docs/#api/en/lights/PointLight"><code class="notranslate" translate="no">PointLight</code></a> is a light that sits at a point and shoots light
in all directions from that point. Let's change the code.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const color = 0xFFFFFF;
-const intensity = 1;
+const intensity = 150;
-const light = new THREE.DirectionalLight(color, intensity);
+const light = new THREE.PointLight(color, intensity);
light.position.set(0, 10, 0);
-light.target.position.set(-5, 0, 0);
scene.add(light);
-scene.add(light.target);
</pre>
<p>Let's also switch to a <a href="/docs/#api/en/helpers/PointLightHelper"><code class="notranslate" translate="no">PointLightHelper</code></a></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-const helper = new THREE.DirectionalLightHelper(light);
+const helper = new THREE.PointLightHelper(light);
scene.add(helper);
</pre>
<p>and as there is no target the <code class="notranslate" translate="no">onChange</code> function can be simpler.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function updateLight() {
-  light.target.updateMatrixWorld();
  helper.update();
}
-updateLight();
</pre>
<p>Note that at some level a <a href="/docs/#api/en/helpers/PointLightHelper"><code class="notranslate" translate="no">PointLightHelper</code></a> has no um, point.
It just draws a small wireframe diamond. It could just as easily
be any shape you want, just add a mesh to the light itself.</p>
<p>A <a href="/docs/#api/en/lights/PointLight"><code class="notranslate" translate="no">PointLight</code></a> has the added property of <a href="/docs/#api/en/lights/PointLight#distance"><code class="notranslate" translate="no">distance</code></a>.
If the <code class="notranslate" translate="no">distance</code> is 0 then the <a href="/docs/#api/en/lights/PointLight"><code class="notranslate" translate="no">PointLight</code></a> shines to
infinity. If the <code class="notranslate" translate="no">distance</code> is greater than 0 then the light shines
its full intensity at the light and fades to no influence at <code class="notranslate" translate="no">distance</code>
units away from the light.</p>
<p>Let's setup the GUI so we can adjust the distance.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const gui = new GUI();
gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
gui.add(light, 'intensity', 0, 2, 0.01);
+gui.add(light, 'distance', 0, 40).onChange(updateLight);

makeXYZGUI(gui, light.position, 'position', updateLight);
-makeXYZGUI(gui, light.target.position, 'target', updateLight);
</pre>
<p>And now try it out.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/lights-point.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/lights-point.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Notice when <code class="notranslate" translate="no">distance</code> is &gt; 0 how the light fades out.</p>
<h2 id="-spotlight-"><a href="/docs/#api/en/lights/SpotLight"><code class="notranslate" translate="no">SpotLight</code></a></h2>
<p>Spotlights are effectively a point light with a cone
attached where the light only shines inside the cone.
There's actually 2 cones. An outer cone and an inner
cone. Between the inner cone and the outer cone the
light fades from full intensity to zero.</p>
<p>To use a <a href="/docs/#api/en/lights/SpotLight"><code class="notranslate" translate="no">SpotLight</code></a> we need a target just like
the directional light. The light's cone will
open toward the target.</p>
<p>Modifying our <a href="/docs/#api/en/lights/DirectionalLight"><code class="notranslate" translate="no">DirectionalLight</code></a> with helper from above</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const color = 0xFFFFFF;
-const intensity = 1;
+const intensity = 150;
-const light = new THREE.DirectionalLight(color, intensity);
+const light = new THREE.SpotLight(color, intensity);
scene.add(light);
scene.add(light.target);

-const helper = new THREE.DirectionalLightHelper(light);
+const helper = new THREE.SpotLightHelper(light);
scene.add(helper);
</pre>
<p>The spotlight's cone's angle is set with the <a href="/docs/#api/en/lights/SpotLight#angle"><code class="notranslate" translate="no">angle</code></a>
property in radians. We'll use our <code class="notranslate" translate="no">DegRadHelper</code> from the
<a href="textures.html">texture article</a> to present a UI in
degrees.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">gui.add(new DegRadHelper(light, 'angle'), 'value', 0, 90).name('angle').onChange(updateLight);
</pre>
<p>The inner cone is defined by setting the <a href="/docs/#api/en/lights/SpotLight#penumbra"><code class="notranslate" translate="no">penumbra</code></a> property
as a percentage from the outer cone. In other words when <code class="notranslate" translate="no">penumbra</code> is 0 then the
inner cone is the same size (0 = no difference) from the outer cone. When the
<code class="notranslate" translate="no">penumbra</code> is 1 then the light fades starting in the center of the cone to the
outer cone. When <code class="notranslate" translate="no">penumbra</code> is .5 then the light fades starting from 50% between
the center of the outer cone.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">gui.add(light, 'penumbra', 0, 1, 0.01);
</pre>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/lights-spot-w-helper.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/lights-spot-w-helper.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Notice with the default <code class="notranslate" translate="no">penumbra</code> of 0 the spotlight has a very sharp edge
whereas as you adjust the <code class="notranslate" translate="no">penumbra</code> toward 1 the edge blurs.</p>
<p>It might be hard to see the <em>cone</em> of the spotlight. The reason is it's
below the ground. Shorten the distance to around 5 and you'll see the open
end of the cone.</p>
<h2 id="-rectarealight-"><a href="/docs/#api/en/lights/RectAreaLight"><code class="notranslate" translate="no">RectAreaLight</code></a></h2>
<p>There's one more type of light, the <a href="/docs/#api/en/lights/RectAreaLight"><code class="notranslate" translate="no">RectAreaLight</code></a>, which represents
exactly what it sounds like, a rectangular area of light like a long
fluorescent light or maybe a frosted sky light in a ceiling.</p>
<p>The <a href="/docs/#api/en/lights/RectAreaLight"><code class="notranslate" translate="no">RectAreaLight</code></a> only works with the <a href="/docs/#api/en/materials/MeshStandardMaterial"><code class="notranslate" translate="no">MeshStandardMaterial</code></a> and the
<a href="/docs/#api/en/materials/MeshPhysicalMaterial"><code class="notranslate" translate="no">MeshPhysicalMaterial</code></a> so let's change all our materials to <a href="/docs/#api/en/materials/MeshStandardMaterial"><code class="notranslate" translate="no">MeshStandardMaterial</code></a></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">  ...

  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
-  const planeMat = new THREE.MeshPhongMaterial({
+  const planeMat = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(planeGeo, planeMat);
  mesh.rotation.x = Math.PI * -.5;
  scene.add(mesh);
}
{
  const cubeSize = 4;
  const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
- const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
+ const cubeMat = new THREE.MeshStandardMaterial({color: '#8AC'});
  const mesh = new THREE.Mesh(cubeGeo, cubeMat);
  mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
  scene.add(mesh);
}
{
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
-  const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
+ const sphereMat = new THREE.MeshStandardMaterial({color: '#CA8'});
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
  scene.add(mesh);
}
</pre>
<p>To use the <a href="/docs/#api/en/lights/RectAreaLight"><code class="notranslate" translate="no">RectAreaLight</code></a> we need to include some extra three.js optional data and we'll
include the <a href="/docs/#api/en/helpers/RectAreaLightHelper"><code class="notranslate" translate="no">RectAreaLightHelper</code></a> to help us visualize the light</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import * as THREE from 'three';
+import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
+import {RectAreaLightHelper} from 'three/addons/helpers/RectAreaLightHelper.js';
</pre>
<p>and we need to call <code class="notranslate" translate="no">RectAreaLightUniformsLib.init</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
+  RectAreaLightUniformsLib.init();
</pre>
<p>If you forget the data the light will still work but it will look funny so
be sure to remember to include the extra data.</p>
<p>Now we can create the light</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const color = 0xFFFFFF;
*const intensity = 5;
+const width = 12;
+const height = 4;
*const light = new THREE.RectAreaLight(color, intensity, width, height);
light.position.set(0, 10, 0);
+light.rotation.x = THREE.MathUtils.degToRad(-90);
scene.add(light);

*const helper = new RectAreaLightHelper(light);
*light.add(helper);
</pre>
<p>One thing to notice is that unlike the <a href="/docs/#api/en/lights/DirectionalLight"><code class="notranslate" translate="no">DirectionalLight</code></a> and the <a href="/docs/#api/en/lights/SpotLight"><code class="notranslate" translate="no">SpotLight</code></a>, the
<a href="/docs/#api/en/lights/RectAreaLight"><code class="notranslate" translate="no">RectAreaLight</code></a> does not use a target. It just uses its rotation. Another thing
to notice is the helper needs to be a child of the light. It is not a child of the
scene like other helpers.</p>
<p>Let's also adjust the GUI. We'll make it so we can rotate the light and adjust
its <code class="notranslate" translate="no">width</code> and <code class="notranslate" translate="no">height</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const gui = new GUI();
gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
gui.add(light, 'intensity', 0, 10, 0.01);
gui.add(light, 'width', 0, 20);
gui.add(light, 'height', 0, 20);
gui.add(new DegRadHelper(light.rotation, 'x'), 'value', -180, 180).name('x rotation');
gui.add(new DegRadHelper(light.rotation, 'y'), 'value', -180, 180).name('y rotation');
gui.add(new DegRadHelper(light.rotation, 'z'), 'value', -180, 180).name('z rotation');

makeXYZGUI(gui, light.position, 'position');
</pre>
<p>And here is that.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/lights-rectarea.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/lights-rectarea.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>It's important to note each light you add to the scene slows down how fast
three.js renders the scene so you should always try to use as few as
possible to achieve your goals.</p>
<p>Next up let's go over <a href="cameras.html">dealing with cameras</a>.</p>
<p><canvas id="c"></canvas></p>
<script type="module" src="../resources/threejs-lights.js"></script>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# load-gltf.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Loading a .GLTF File</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Loading a .GLTF File">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Loading a .GLTF File</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>In a previous lesson we <a href="load-obj.html">loaded an .OBJ file</a>. If
you haven't read it you might want to check it out first.</p>
<p>As pointed out over there the .OBJ file format is very old and fairly
simple. It provides no scene graph so everything loaded is one large
mesh. It was designed mostly as a simple way to pass data between
3D editors.</p>
<p><a href="https://github.com/KhronosGroup/glTF">The gLTF format</a> is actually
a format designed from the ground up for be used for displaying
graphics. 3D formats can be divided into 3 or 4 basic types.</p>
<ul>
<li><p>3D Editor Formats</p>
<p>This are formats specific to a single app. .blend (Blender), .max (3d Studio Max),
.mb and .ma (Maya), etc...</p>
</li>
<li><p>Exchange formats</p>
<p>These are formats like .OBJ, .DAE (Collada), .FBX. They are designed to help exchange
information between 3D editors. As such they are usually much larger than needed with
extra info used only inside 3d editors</p>
</li>
<li><p>App formats</p>
<p>These are usually specific to certain apps, usually games.</p>
</li>
<li><p>Transmission formats</p>
<p>gLTF might be the first true transmission format. I suppose VRML might be considered
one but VRML was actually a pretty poor format.</p>
<p>gLTF is designed to do some things well that all those other formats don't do</p>
<ol>
<li><p>Be small for transmission</p>
<p>For example this means much of their large data, like vertices, is stored in
binary. When you download a .gLTF file that data can be uploaded to the GPU
with zero processing. It's ready as is. This is in contrast to say VRML, .OBJ,
or .DAE where vertices are stored as text and have to be parsed. Text vertex
positions can easily be 3x to 5x larger than binary.</p>
</li>
<li><p>Be ready to render</p>
<p>This again is different from other formats except maybe App formats. The data
in a glTF file is mean to be rendered, not edited. Data that's not important to
rendering has generally been removed. Polygons have been converted to triangles.
Materials have known values that are supposed to work everywhere.</p>
</li>
</ol>
</li>
</ul>
<p>gLTF was specifically designed so you should be able to download a glTF file and
display it with a minimum of trouble. Let's cross our fingers that's truly the case
as none of the other formats have been able to do this.</p>
<p>I wasn't really sure what I should show. At some level loading and displaying a gLTF file
is simpler than an .OBJ file. Unlike a .OBJ file materials are directly part of the format.
That said I thought I should at least load one up and I think going over the issues I ran
into might provide some good info.</p>
<p>Searching the net I found <a href="https://sketchfab.com/models/edd1c604e1e045a0a2a552ddd9a293e6">this low-poly city</a>
by <a href="https://sketchfab.com/antonmoek">antonmoek</a> which seemed like if we're lucky
might make a good example.</p>
<div class="threejs_center"><img src="../resources/images/cartoon_lowpoly_small_city_free_pack.jpg"></div>

<p>Starting with <a href="load-obj.html">an example from the .OBJ article</a> I removed the code
for loading .OBJ and replaced it with code for loading .GLTF</p>
<p>The old .OBJ code was</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const mtlLoader = new MTLLoader();
mtlLoader.loadMtl('resources/models/windmill/windmill-fixed.mtl', (mtl) =&gt; {
  mtl.preload();
  mtl.materials.Material.side = THREE.DoubleSide;
  objLoader.setMaterials(mtl);
  objLoader.load('resources/models/windmill/windmill.obj', (event) =&gt; {
    const root = event.detail.loaderRootNode;
    scene.add(root);
    ...
  });
});
</pre>
<p>The new .GLTF code is</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const gltfLoader = new GLTFLoader();
  const url = 'resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf';
  gltfLoader.load(url, (gltf) =&gt; {
    const root = gltf.scene;
    scene.add(root);
    ...
  });
</pre>
<p>I kept the auto framing code as before</p>
<p>We also need to include the <a href="/docs/#examples/loaders/GLTFLoader"><code class="notranslate" translate="no">GLTFLoader</code></a> and we can get rid of the <a href="/docs/#examples/loaders/OBJLoader"><code class="notranslate" translate="no">OBJLoader</code></a>.</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">-import {LoaderSupport} from 'three/addons/loaders/LoaderSupport.js';
-import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
-import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
+import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
</pre>
<p>And running that we get</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/load-gltf.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/load-gltf.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Magic! It just works, textures and all.</p>
<p>Next I wanted to see if I could animate the cars driving around so
I needed to check if the scene had the cars as separate entities
and if they were setup in a way I could use them.</p>
<p>I wrote some code to dump put the scenegraph to the <a href="debugging-javascript.html">JavaScript
console</a>.</p>
<p>Here's the code to print out the scenegraph.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function dumpObject(obj, lines = [], isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─';
  lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
  const newPrefix = prefix + (isLast ? '  ' : '│ ');
  const lastNdx = obj.children.length - 1;
  obj.children.forEach((child, ndx) =&gt; {
    const isLast = ndx === lastNdx;
    dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
}
</pre>
<p>And I just called it right after loading the scene.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const gltfLoader = new GLTFLoader();
gltfLoader.load('resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf', (gltf) =&gt; {
  const root = gltf.scene;
  scene.add(root);
  console.log(dumpObject(root).join('\n'));
</pre>
<p><a href="../examples/load-gltf-dump-scenegraph.html">Running that</a> I got this listing</p>
<pre class="prettyprint showlinemods notranslate lang-text" translate="no">OSG_Scene [Scene]
  └─RootNode_(gltf_orientation_matrix) [Object3D]
    └─RootNode_(model_correction_matrix) [Object3D]
      └─4d4100bcb1c640e69699a87140df79d7fbx [Object3D]
        └─RootNode [Object3D]
          │ ...
          ├─Cars [Object3D]
          │ ├─CAR_03_1 [Object3D]
          │ │ └─CAR_03_1_World_ap_0 [Mesh]
          │ ├─CAR_03 [Object3D]
          │ │ └─CAR_03_World_ap_0 [Mesh]
          │ ├─Car_04 [Object3D]
          │ │ └─Car_04_World_ap_0 [Mesh]
          │ ├─CAR_03_2 [Object3D]
          │ │ └─CAR_03_2_World_ap_0 [Mesh]
          │ ├─Car_04_1 [Object3D]
          │ │ └─Car_04_1_World_ap_0 [Mesh]
          │ ├─Car_04_2 [Object3D]
          │ │ └─Car_04_2_World_ap_0 [Mesh]
          │ ├─Car_04_3 [Object3D]
          │ │ └─Car_04_3_World_ap_0 [Mesh]
          │ ├─Car_04_4 [Object3D]
          │ │ └─Car_04_4_World_ap_0 [Mesh]
          │ ├─Car_08_4 [Object3D]
          │ │ └─Car_08_4_World_ap8_0 [Mesh]
          │ ├─Car_08_3 [Object3D]
          │ │ └─Car_08_3_World_ap9_0 [Mesh]
          │ ├─Car_04_1_2 [Object3D]
          │ │ └─Car_04_1_2_World_ap_0 [Mesh]
          │ ├─Car_08_2 [Object3D]
          │ │ └─Car_08_2_World_ap11_0 [Mesh]
          │ ├─CAR_03_1_2 [Object3D]
          │ │ └─CAR_03_1_2_World_ap_0 [Mesh]
          │ ├─CAR_03_2_2 [Object3D]
          │ │ └─CAR_03_2_2_World_ap_0 [Mesh]
          │ ├─Car_04_2_2 [Object3D]
          │ │ └─Car_04_2_2_World_ap_0 [Mesh]
          ...
</pre>
<p>From that we can see all the cars happen to be under a parent
called <code class="notranslate" translate="no">"Cars"</code></p>
<pre class="prettyprint showlinemods notranslate lang-text" translate="no">*          ├─Cars [Object3D]
          │ ├─CAR_03_1 [Object3D]
          │ │ └─CAR_03_1_World_ap_0 [Mesh]
          │ ├─CAR_03 [Object3D]
          │ │ └─CAR_03_World_ap_0 [Mesh]
          │ ├─Car_04 [Object3D]
          │ │ └─Car_04_World_ap_0 [Mesh]
</pre>
<p>So as a simple test I thought I would just try rotating
all the children of the "Cars" node around their Y axis.</p>
<p>I looked up the "Cars" node after loading the scene
and saved the result.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+let cars;
{
  const gltfLoader = new GLTFLoader();
  gltfLoader.load('resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf', (gltf) =&gt; {
    const root = gltf.scene;
    scene.add(root);
+    cars = root.getObjectByName('Cars');
</pre>
<p>Then in the <code class="notranslate" translate="no">render</code> function we can just set the rotation
of each child of <code class="notranslate" translate="no">cars</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+function render(time) {
+  time *= 0.001;  // convert to seconds

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

+  if (cars) {
+    for (const car of cars.children) {
+      car.rotation.y = time;
+    }
+  }

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
</pre>
<p>And we get</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/load-gltf-rotate-cars.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/load-gltf-rotate-cars.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Hmmm, it looks like unfortunately this scene wasn't designed to
animate the cars as their origins are not setup for that purpose.
The trucks are rotating in the wrong direction.</p>
<p>This brings up an important point which is if you're going to
do something in 3D you need to plan ahead and design your assets
so they have their origins in the correct places, so they are
the correct scale, etc.</p>
<p>Since I'm not an artist and I don't know blender that well I
will hack this example. We'll take each car and parent it to
another <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a>. We will then move those <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> objects
to move the cars but separately we can set the car's original
<a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> to re-orient it so it's about where we really need it.</p>
<p>Looking back at the scene graph listing it looks like there
are really only 3 types of cars, "Car_08", "CAR_03", and "Car_04".
Hopefully each type of car will work with the same adjustments.</p>
<p>I wrote this code to go through each car, parent it to a new
<a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a>, parent that new <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> to the scene, and apply
some per car <em>type</em> settings to fix its orientation, and add
the new <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> a <code class="notranslate" translate="no">cars</code> array.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-let cars;
+const cars = [];
{
  const gltfLoader = new GLTFLoader();
  gltfLoader.load('resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf', (gltf) =&gt; {
    const root = gltf.scene;
    scene.add(root);

-    cars = root.getObjectByName('Cars');
+    const loadedCars = root.getObjectByName('Cars');
+    const fixes = [
+      { prefix: 'Car_08', rot: [Math.PI * .5, 0, Math.PI * .5], },
+      { prefix: 'CAR_03', rot: [0, Math.PI, 0], },
+      { prefix: 'Car_04', rot: [0, Math.PI, 0], },
+    ];
+
+    root.updateMatrixWorld();
+    for (const car of loadedCars.children.slice()) {
+      const fix = fixes.find(fix =&gt; car.name.startsWith(fix.prefix));
+      const obj = new THREE.Object3D();
+      car.getWorldPosition(obj.position);
+      car.position.set(0, 0, 0);
+      car.rotation.set(...fix.rot);
+      obj.add(car);
+      scene.add(obj);
+      cars.push(obj);
+    }
     ...
</pre>
<p>This fixes the orientation of the cars. </p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/load-gltf-rotate-cars-fixed.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/load-gltf-rotate-cars-fixed.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Now let's drive them around.</p>
<p>Making even a simple driving system is too much for this post but
it seems instead we could just make one convoluted path that
drives down all the roads and then put the cars on the path.
Here's a picture from Blender about half way through building
the path.</p>
<div class="threejs_center"><img src="../resources/images/making-path-for-cars.jpg" style="width: 1094px"></div>

<p>I needed a way to get the data for that path out of Blender.
Fortunately I was able to select just my path and export .OBJ checking "write nurbs".</p>
<div class="threejs_center"><img src="../resources/images/blender-export-obj-write-nurbs.jpg" style="width: 498px"></div>

<p>Opening the .OBJ file I was able to get a list of points
which I formatted into this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const controlPoints = [
  [1.118281, 5.115846, -3.681386],
  [3.948875, 5.115846, -3.641834],
  [3.960072, 5.115846, -0.240352],
  [3.985447, 5.115846, 4.585005],
  [-3.793631, 5.115846, 4.585006],
  [-3.826839, 5.115846, -14.736200],
  [-14.542292, 5.115846, -14.765865],
  [-14.520929, 5.115846, -3.627002],
  [-5.452815, 5.115846, -3.634418],
  [-5.467251, 5.115846, 4.549161],
  [-13.266233, 5.115846, 4.567083],
  [-13.250067, 5.115846, -13.499271],
  [4.081842, 5.115846, -13.435463],
  [4.125436, 5.115846, -5.334928],
  [-14.521364, 5.115846, -5.239871],
  [-14.510466, 5.115846, 5.486727],
  [5.745666, 5.115846, 5.510492],
  [5.787942, 5.115846, -14.728308],
  [-5.423720, 5.115846, -14.761919],
  [-5.373599, 5.115846, -3.704133],
  [1.004861, 5.115846, -3.641834],
];
</pre>
<p>THREE.js has some curve classes. The <a href="/docs/#api/en/extras/curves/CatmullRomCurve3"><code class="notranslate" translate="no">CatmullRomCurve3</code></a> seemed
like it might work. The thing about that kind of curve is
it tries to make a smooth curve going through the points.</p>
<p>In fact putting those points in directly will generate
a curve like this</p>
<div class="threejs_center"><img src="../resources/images/car-curves-before.png" style="width: 400px"></div>

<p>but we want a sharper corners. It seemed like if we computed
some extra points we could get what we want. For each pair
of points we'll compute a point 10% of the way between
the 2 points and another 90% of the way between the 2 points
and pass the result to <a href="/docs/#api/en/extras/curves/CatmullRomCurve3"><code class="notranslate" translate="no">CatmullRomCurve3</code></a>.</p>
<p>This will give us a curve like this</p>
<div class="threejs_center"><img src="../resources/images/car-curves-after.png" style="width: 400px"></div>

<p>Here's the code to make the curve </p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">let curve;
let curveObject;
{
  const controlPoints = [
    [1.118281, 5.115846, -3.681386],
    [3.948875, 5.115846, -3.641834],
    [3.960072, 5.115846, -0.240352],
    [3.985447, 5.115846, 4.585005],
    [-3.793631, 5.115846, 4.585006],
    [-3.826839, 5.115846, -14.736200],
    [-14.542292, 5.115846, -14.765865],
    [-14.520929, 5.115846, -3.627002],
    [-5.452815, 5.115846, -3.634418],
    [-5.467251, 5.115846, 4.549161],
    [-13.266233, 5.115846, 4.567083],
    [-13.250067, 5.115846, -13.499271],
    [4.081842, 5.115846, -13.435463],
    [4.125436, 5.115846, -5.334928],
    [-14.521364, 5.115846, -5.239871],
    [-14.510466, 5.115846, 5.486727],
    [5.745666, 5.115846, 5.510492],
    [5.787942, 5.115846, -14.728308],
    [-5.423720, 5.115846, -14.761919],
    [-5.373599, 5.115846, -3.704133],
    [1.004861, 5.115846, -3.641834],
  ];
  const p0 = new THREE.Vector3();
  const p1 = new THREE.Vector3();
  curve = new THREE.CatmullRomCurve3(
    controlPoints.map((p, ndx) =&gt; {
      p0.set(...p);
      p1.set(...controlPoints[(ndx + 1) % controlPoints.length]);
      return [
        (new THREE.Vector3()).copy(p0),
        (new THREE.Vector3()).lerpVectors(p0, p1, 0.1),
        (new THREE.Vector3()).lerpVectors(p0, p1, 0.9),
      ];
    }).flat(),
    true,
  );
  {
    const points = curve.getPoints(250);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({color: 0xff0000});
    curveObject = new THREE.Line(geometry, material);
    scene.add(curveObject);
  }
}
</pre>
<p>The first part of that code makes a curve.
The second part of that code generates 250 points
from the curve and then creates an object to display
the lines made by connecting those 250 points.</p>
<p>Running <a href="../examples/load-gltf-car-path.html">the example</a> I didn't see
the curve. To make it visible I made it ignore the depth test and
render last</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">    curveObject = new THREE.Line(geometry, material);
+    material.depthTest = false;
+    curveObject.renderOrder = 1;
</pre>
<p>And that's when I discovered it was way too small.</p>
<div class="threejs_center"><img src="../resources/images/car-curves-too-small.png" style="width: 498px"></div>

<p>Checking the hierarchy in Blender I found out that the artist had
scaled the node all the cars are parented to.</p>
<div class="threejs_center"><img src="../resources/images/cars-scale-0.01.png" style="width: 342px;"></div>

<p>Scaling is bad for real time 3D apps. It causes all kinds of
issues and ends up being no end of frustration when doing
real time 3D. Artists often don't know this because it's so
easy to scale an entire scene in a 3D editing program but
if you decide to make a real time 3D app I suggest you request your
artists to never scale anything. If they change the scale
they should find a way to apply that scale to the vertices
so that when it ends up making it to your app you can ignore
scale.</p>
<p>And, not just scale, in this case the cars are rotated and offset
by their parent, the <code class="notranslate" translate="no">Cars</code> node. This will make it hard at runtime
to move the cars around in world space. To be clear, in this case
we want cars to drive around in world space which is why these
issues are coming up. If something that is meant to be manipulated
in a local space, like the moon revolving around the earth this
is less of an issue.</p>
<p>Going back to the function we wrote above to dump the scene graph,
let's dump the position, rotation, and scale of each node.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+function dumpVec3(v3, precision = 3) {
+  return `${v3.x.toFixed(precision)}, ${v3.y.toFixed(precision)}, ${v3.z.toFixed(precision)}`;
+}

function dumpObject(obj, lines, isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─';
  lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
+  const dataPrefix = obj.children.length
+     ? (isLast ? '  │ ' : '│ │ ')
+     : (isLast ? '    ' : '│   ');
+  lines.push(`${prefix}${dataPrefix}  pos: ${dumpVec3(obj.position)}`);
+  lines.push(`${prefix}${dataPrefix}  rot: ${dumpVec3(obj.rotation)}`);
+  lines.push(`${prefix}${dataPrefix}  scl: ${dumpVec3(obj.scale)}`);
  const newPrefix = prefix + (isLast ? '  ' : '│ ');
  const lastNdx = obj.children.length - 1;
  obj.children.forEach((child, ndx) =&gt; {
    const isLast = ndx === lastNdx;
    dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
}
</pre>
<p>And the result from <a href="../examples/load-gltf-dump-scenegraph-extra.html">running it</a></p>
<pre class="prettyprint showlinemods notranslate lang-text" translate="no">OSG_Scene [Scene]
  │   pos: 0.000, 0.000, 0.000
  │   rot: 0.000, 0.000, 0.000
  │   scl: 1.000, 1.000, 1.000
  └─RootNode_(gltf_orientation_matrix) [Object3D]
    │   pos: 0.000, 0.000, 0.000
    │   rot: -1.571, 0.000, 0.000
    │   scl: 1.000, 1.000, 1.000
    └─RootNode_(model_correction_matrix) [Object3D]
      │   pos: 0.000, 0.000, 0.000
      │   rot: 0.000, 0.000, 0.000
      │   scl: 1.000, 1.000, 1.000
      └─4d4100bcb1c640e69699a87140df79d7fbx [Object3D]
        │   pos: 0.000, 0.000, 0.000
        │   rot: 1.571, 0.000, 0.000
        │   scl: 1.000, 1.000, 1.000
        └─RootNode [Object3D]
          │   pos: 0.000, 0.000, 0.000
          │   rot: 0.000, 0.000, 0.000
          │   scl: 1.000, 1.000, 1.000
          ├─Cars [Object3D]
*          │ │   pos: -369.069, -90.704, -920.159
*          │ │   rot: 0.000, 0.000, 0.000
*          │ │   scl: 1.000, 1.000, 1.000
          │ ├─CAR_03_1 [Object3D]
          │ │ │   pos: 22.131, 14.663, -475.071
          │ │ │   rot: -3.142, 0.732, 3.142
          │ │ │   scl: 1.500, 1.500, 1.500
          │ │ └─CAR_03_1_World_ap_0 [Mesh]
          │ │       pos: 0.000, 0.000, 0.000
          │ │       rot: 0.000, 0.000, 0.000
          │ │       scl: 1.000, 1.000, 1.000
</pre>
<p>This shows us that <code class="notranslate" translate="no">Cars</code> in the original scene has had its rotation and scale
removed and applied to its children. That suggests either whatever exporter was
used to create the .GLTF file did some special work here or more likely the
artist exported a different version of the file than the corresponding .blend
file, which is why things don't match.</p>
<p>The moral of that is I should have probably downloaded the .blend
file and exported myself. Before exporting I should have inspected
all the major nodes and removed any transformations.</p>
<p>All these nodes at the top</p>
<pre class="prettyprint showlinemods notranslate lang-text" translate="no">OSG_Scene [Scene]
  │   pos: 0.000, 0.000, 0.000
  │   rot: 0.000, 0.000, 0.000
  │   scl: 1.000, 1.000, 1.000
  └─RootNode_(gltf_orientation_matrix) [Object3D]
    │   pos: 0.000, 0.000, 0.000
    │   rot: -1.571, 0.000, 0.000
    │   scl: 1.000, 1.000, 1.000
    └─RootNode_(model_correction_matrix) [Object3D]
      │   pos: 0.000, 0.000, 0.000
      │   rot: 0.000, 0.000, 0.000
      │   scl: 1.000, 1.000, 1.000
      └─4d4100bcb1c640e69699a87140df79d7fbx [Object3D]
        │   pos: 0.000, 0.000, 0.000
        │   rot: 1.571, 0.000, 0.000
        │   scl: 1.000, 1.000, 1.000
</pre>
<p>are also a waste.</p>
<p>Ideally the scene would consist of a single "root" node with no position,
rotation, or scale. At runtime I could then pull all the children out of that
root and parent them to the scene itself. There might be children of the root
like "Cars" which would help me find all the cars but ideally it would also have
no translation, rotation, or scale so I could re-parent the cars to the scene
with the minimal amount of work.</p>
<p>In any case the quickest though maybe not the best fix is to just
adjust the object we're using to view the curve.</p>
<p>Here's what I ended up with.</p>
<p>First I adjusted the position of the curve and found values
that seemed to work. I then hid it.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const points = curve.getPoints(250);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({color: 0xff0000});
  curveObject = new THREE.Line(geometry, material);
+  curveObject.scale.set(100, 100, 100);
+  curveObject.position.y = -621;
+  curveObject.visible = false;
  material.depthTest = false;
  curveObject.renderOrder = 1;
  scene.add(curveObject);
}
</pre>
<p>Then I wrote code to move the cars along the curve. For each car we pick a
position from 0 to 1 along the curve and compute a point in world space using
the <code class="notranslate" translate="no">curveObject</code> to transform the point. We then pick another point slightly
further down the curve. We set the car's orientation using <code class="notranslate" translate="no">lookAt</code> and put the
car at the mid point between the 2 points.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// create 2 Vector3s we can use for path calculations
const carPosition = new THREE.Vector3();
const carTarget = new THREE.Vector3();

function render(time) {
  ...

-  for (const car of cars) {
-    car.rotation.y = time;
-  }

+  {
+    const pathTime = time * .01;
+    const targetOffset = 0.01;
+    cars.forEach((car, ndx) =&gt; {
+      // a number between 0 and 1 to evenly space the cars
+      const u = pathTime + ndx / cars.length;
+
+      // get the first point
+      curve.getPointAt(u % 1, carPosition);
+      carPosition.applyMatrix4(curveObject.matrixWorld);
+
+      // get a second point slightly further down the curve
+      curve.getPointAt((u + targetOffset) % 1, carTarget);
+      carTarget.applyMatrix4(curveObject.matrixWorld);
+
+      // put the car at the first point (temporarily)
+      car.position.copy(carPosition);
+      // point the car the second point
+      car.lookAt(carTarget);
+
+      // put the car between the 2 points
+      car.position.lerpVectors(carPosition, carTarget, 0.5);
+    });
+  }
</pre>
<p>and when I ran it I found out for each type of car, their height above their origins
are not consistently set and so I needed to offset each one
a little.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const loadedCars = root.getObjectByName('Cars');
const fixes = [
-  { prefix: 'Car_08', rot: [Math.PI * .5, 0, Math.PI * .5], },
-  { prefix: 'CAR_03', rot: [0, Math.PI, 0], },
-  { prefix: 'Car_04', rot: [0, Math.PI, 0], },
+  { prefix: 'Car_08', y: 0,  rot: [Math.PI * .5, 0, Math.PI * .5], },
+  { prefix: 'CAR_03', y: 33, rot: [0, Math.PI, 0], },
+  { prefix: 'Car_04', y: 40, rot: [0, Math.PI, 0], },
];

root.updateMatrixWorld();
for (const car of loadedCars.children.slice()) {
  const fix = fixes.find(fix =&gt; car.name.startsWith(fix.prefix));
  const obj = new THREE.Object3D();
  car.getWorldPosition(obj.position);
-  car.position.set(0, 0, 0);
+  car.position.set(0, fix.y, 0);
  car.rotation.set(...fix.rot);
  obj.add(car);
  scene.add(obj);
  cars.push(obj);
}
</pre>
<p>And the result.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/load-gltf-animated-cars.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/load-gltf-animated-cars.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Not bad for a few minutes work.</p>
<p>The last thing I wanted to do is turn on shadows.</p>
<p>To do this I grabbed all the GUI code from the <a href="/docs/#api/en/lights/DirectionalLight"><code class="notranslate" translate="no">DirectionalLight</code></a> shadows
example in <a href="shadows.html">the article on shadows</a> and pasted it
into our latest code.</p>
<p>Then, after loading, we need to turn on shadows on all the objects.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const gltfLoader = new GLTFLoader();
  gltfLoader.load('resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf', (gltf) =&gt; {
    const root = gltf.scene;
    scene.add(root);

+    root.traverse((obj) =&gt; {
+      if (obj.castShadow !== undefined) {
+        obj.castShadow = true;
+        obj.receiveShadow = true;
+      }
+    });
</pre>
<p>I then spent nearly 4 hours trying to figure out why the shadow helpers
were not working. It was because I forgot to enable shadows with</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">renderer.shadowMap.enabled = true;
</pre>
<p>😭</p>
<p>I then adjusted the values until our <code class="notranslate" translate="no">DirectionLight</code>'s shadow camera
had a frustum that covered the entire scene. These are the settings
I ended up with.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
+  light.castShadow = true;
*  light.position.set(-250, 800, -850);
*  light.target.position.set(-550, 40, -450);

+  light.shadow.bias = -0.004;
+  light.shadow.mapSize.width = 2048;
+  light.shadow.mapSize.height = 2048;

  scene.add(light);
  scene.add(light.target);
+  const cam = light.shadow.camera;
+  cam.near = 1;
+  cam.far = 2000;
+  cam.left = -1500;
+  cam.right = 1500;
+  cam.top = 1500;
+  cam.bottom = -1500;
...
</pre>
<p>and I set the background color to light blue.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const scene = new THREE.Scene();
-scene.background = new THREE.Color('black');
+scene.background = new THREE.Color('#DEFEFF');
</pre>
<p>And ... shadows</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/load-gltf-shadows.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/load-gltf-shadows.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>I hope walking through this project was useful and showed some
good examples of working though some of the issues of loading
a file with a scenegraph.</p>
<p>One interesting thing is that comparing the .blend file to the .gltf
file, the .blend file has several lights but they are not lights
after being loaded into the scene. A .GLTF file is just a JSON
file so you can easily look inside. It consists of several
arrays of things and each item in an array is referenced by index
else where. While there are extensions in the works they point
to a problem with almost all 3d formats. <strong>They can never cover every
case</strong>.</p>
<p>There is always a need for more data. For example we manually exported
a path for the cars to follow. Ideally that info could have been in
the .GLTF file but to do that we'd need to write our own exporter
and some how mark nodes for how we want them exported or use a
naming scheme or something along those lines to get data from
whatever tool we're using to create the data into our app.</p>
<p>All of that is left as an exercise to the reader.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>


# load-obj.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Loading a .OBJ File</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Loading a .OBJ File">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Loading a .OBJ File</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>One of the most common things people want to do with three.js
is to load and display 3D models. A common format is the .OBJ
3D format so let's try loading one.</p>
<p>Searching the net I found <a href="https://www.blendswap.com/blends/view/69174">this CC-BY-NC 3.0 windmill 3D model</a> by <a href="https://www.blendswap.com/user/ahedov">ahedov</a>.</p>
<div class="threejs_center"><img src="../resources/images/windmill-obj.jpg"></div>

<p>I downloaded the .blend file from that site, loaded it into <a href="https://blender.org">Blender</a>
and exported it as an .OBJ file.</p>
<div class="threejs_center"><img style="width: 827px;" src="../resources/images/windmill-export-as-obj.jpg"></div>

<blockquote>
<p>Note: If you've never used Blender you might be in for a surprise
in that Blender does things differently than just about every
other program you've ever used. Just be aware you might need to
set aside some time to read some basic UI navigation for Blender.</p>
<p>Let me also add that 3D programs in general are giant beasts with
1000s of features. They are some of the most complicated software there
is. When I first learned 3D Studio Max in 1996 I read through 70% of the
600 page manual spending a few hours a day for around 3 weeks. That paid
off in that when I learned Maya a few years later some of the lessons
learned before were applicable to Maya. So, just be aware that if you
really want to be able to use 3D software to either build 3D assets
or to modify existing ones put it on your schedule and clear sometime
to really go through some lessons.</p>
</blockquote>
<p>In any case I used these export options</p>
<div class="threejs_center"><img style="width: 239px;" src="../resources/images/windmill-export-options.jpg"></div>

<p>Let's try to display it!</p>
<p>I started with the directional lighting example from
<a href="lights.html">the lights article</a> and I combined it with
the hemispherical lighting example so I ended up with one
<a href="/docs/#api/en/lights/HemisphereLight"><code class="notranslate" translate="no">HemisphereLight</code></a> and one <a href="/docs/#api/en/lights/DirectionalLight"><code class="notranslate" translate="no">DirectionalLight</code></a>. I also removed all the GUI stuff
related to adjusting the lights. I also removed the cube and sphere
that were being added to the scene.</p>
<p>From that the first thing we need to do is include the <a href="/docs/#examples/loaders/OBJLoader"><code class="notranslate" translate="no">OBJLoader</code></a> loader in our script.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
</pre>
<p>Then to load the .OBJ file we create an instance of <a href="/docs/#examples/loaders/OBJLoader"><code class="notranslate" translate="no">OBJLoader</code></a>,
pass it the URL of our .OBJ file, and pass in a callback that adds
the loaded model to our scene.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const objLoader = new OBJLoader();
  objLoader.load('resources/models/windmill/windmill.obj', (root) =&gt; {
    scene.add(root);
  });
}
</pre>
<p>If we run that what happens?</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/load-obj-no-materials.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/load-obj-no-materials.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Well it's close but we're getting errors about materials since we haven't
given the scene any materials and .OBJ files don't have material
parameters. </p>
<p>The .OBJ loader can be passed an
object of name / material pairs. When it loads the .OBJ file,
any material name it finds it will look for the corresponding material
in the map of materials set on the loader. If it finds a
material that matches by name it will use that material. If
not it will use the loader's default material.</p>
<p>Sometimes .OBJ files come with a .MTL file that defines
materials. In our case the exporter also created a .MTL file.
.MTL format is plain ASCII so it's easy to look at. Looking at it here</p>
<pre class="prettyprint showlinemods notranslate lang-mtl" translate="no"># Blender MTL File: 'windmill_001.blend'
# Material Count: 2

newmtl Material
Ns 0.000000
Ka 1.000000 1.000000 1.000000
Kd 0.800000 0.800000 0.800000
Ks 0.000000 0.000000 0.000000
Ke 0.000000 0.000000 0.000000
Ni 1.000000
d 1.000000
illum 1
map_Kd windmill_001_lopatky_COL.jpg
map_Bump windmill_001_lopatky_NOR.jpg

newmtl windmill
Ns 0.000000
Ka 1.000000 1.000000 1.000000
Kd 0.800000 0.800000 0.800000
Ks 0.000000 0.000000 0.000000
Ke 0.000000 0.000000 0.000000
Ni 1.000000
d 1.000000
illum 1
map_Kd windmill_001_base_COL.jpg
map_Bump windmill_001_base_NOR.jpg
map_Ns windmill_001_base_SPEC.jpg
</pre>
<p>We can see there are 2 materials referencing 5 jpg textures
but where are the texture files?</p>
<div class="threejs_center"><img style="width: 757px;" src="../resources/images/windmill-exported-files.png"></div>

<p>All we got was an .OBJ file and an .MTL file.</p>
<p>At least for this model it turns out the textures are embedded
in the .blend file we downloaded. We can ask blender to
export those files to by picking <strong>File-&gt;External Data-&gt;Unpack All Into Files</strong></p>
<div class="threejs_center"><img style="width: 828px;" src="../resources/images/windmill-export-textures.jpg"></div>

<p>and then choosing <strong>Write Files to Current Directory</strong></p>
<div class="threejs_center"><img style="width: 828px;" src="../resources/images/windmill-overwrite.jpg"></div>

<p>This ends up writing the files in the same folder as the .blend file
in a sub folder called <strong>textures</strong>.</p>
<div class="threejs_center"><img style="width: 758px;" src="../resources/images/windmill-exported-texture-files.png"></div>

<p>I copied those textures into the same folder I exported the .OBJ
file to.</p>
<div class="threejs_center"><img style="width: 757px;" src="../resources/images/windmill-exported-files-with-textures.png"></div>

<p>Now that we have the textures available we can load the .MTL file.</p>
<p>First we need to include the <a href="/docs/#examples/loaders/MTLLoader"><code class="notranslate" translate="no">MTLLoader</code></a>;</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
+import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
</pre>
<p>Then we first load the .MTL file. When it's finished loading we add
the just loaded materials on to the <a href="/docs/#examples/loaders/OBJLoader"><code class="notranslate" translate="no">OBJLoader</code></a> itself via the <code class="notranslate" translate="no">setMaterials</code>
and then load the .OBJ file.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
+  const mtlLoader = new MTLLoader();
+  mtlLoader.load('resources/models/windmill/windmill.mtl', (mtl) =&gt; {
+    mtl.preload();
+    objLoader.setMaterials(mtl);
    objLoader.load('resources/models/windmill/windmill.obj', (root) =&gt; {
      scene.add(root);
    });
+  });
}
</pre>
<p>And if we try that...</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/load-obj-materials.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/load-obj-materials.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Note that if we spin the model around you'll see the windmill cloth
disappears</p>
<div class="threejs_center"><img style="width: 528px;" src="../resources/images/windmill-missing-cloth.jpg"></div>

<p>We need the material on the blades to be double sided, something
we went over in <a href="materials.html">the article on materials</a>.
There is no easy way to fix this in the .MTL file. Off the top of my
head I can think of 3 ways to fix this.</p>
<ol>
<li><p>Loop over all the materials after loading them and set them all to double sided.</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no"> const mtlLoader = new MTLLoader();
 mtlLoader.load('resources/models/windmill/windmill.mtl', (mtl) =&gt; {
   mtl.preload();
   for (const material of Object.values(mtl.materials)) {
     material.side = THREE.DoubleSide;
   }
   ...
</pre><p>This solution works but ideally we only want materials that need
to be double sided to be double sided because drawing double sided
is slower than single sided.</p>
</li>
<li><p>Manually set a specific material</p>
<p>Looking in the .MTL file there are 2 materials. One called <code class="notranslate" translate="no">"windmill"</code>
and the other called <code class="notranslate" translate="no">"Material"</code>. Through trial and error I figured
out the blades use the material called <code class="notranslate" translate="no">"Material"</code>so we could set
that one specifically </p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no"> const mtlLoader = new MTLLoader();
 mtlLoader.load('resources/models/windmill/windmill.mtl', (mtl) =&gt; {
   mtl.preload();
   mtl.materials.Material.side = THREE.DoubleSide;
   ...
</pre></li>
<li><p>Realizing that the .MTL file is limited we could just not use it
and instead create materials ourselves.</p>
<p>In this case we'd need to look up the <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> object after
loading the obj file.</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no"> objLoader.load('resources/models/windmill/windmill.obj', (root) =&gt; {
   const materials = {
     Material: new THREE.MeshPhongMaterial({...}),
     windmill: new THREE.MeshPhongMaterial({...}),
   };
   root.traverse(node =&gt; {
     const material = materials[node.material?.name];
     if (material) {
       node.material = material;
     }
   })
   scene.add(root);
 });
</pre></li>
</ol>
<p>Which one you pick is up to you. 1 is easiest. 3 is most flexible.
2 somewhere in between. For now I'll pick 2.</p>
<p>And with that change you should still see the cloth on the blades
when looking from behind but there's one more issue. If we zoom in close
we see things are turning blocky.</p>
<div class="threejs_center"><img style="width: 700px;" src="../resources/images/windmill-blocky.jpg"></div>

<p>What's going on?</p>
<p>Looking at the textures there are 2 textures labelled NOR for NORmal map.
And looking at them they look like normal maps. Normal maps are generally
purple where as bump maps are black and white. Normal maps represent
the direction of the surface where as bump maps represent the height of
the surface.</p>
<div class="threejs_center"><img style="width: 256px;" src="../examples/resources/models/windmill/windmill_001_base_NOR.jpg"></div>

<p>Looking at <a href="https://github.com/mrdoob/three.js/blob/1a560a3426e24bbfc9ca1f5fb0dfb4c727d59046/examples/js/loaders/MTLLoader.js#L432">the source for the MTLLoader</a>
it expects the keyword <code class="notranslate" translate="no">norm</code> for normal maps so let's edit the .MTL file</p>
<pre class="prettyprint showlinemods notranslate lang-mtl" translate="no"># Blender MTL File: 'windmill_001.blend'
# Material Count: 2

newmtl Material
Ns 0.000000
Ka 1.000000 1.000000 1.000000
Kd 0.800000 0.800000 0.800000
Ks 0.000000 0.000000 0.000000
Ke 0.000000 0.000000 0.000000
Ni 1.000000
d 1.000000
illum 1
map_Kd windmill_001_lopatky_COL.jpg
-map_Bump windmill_001_lopatky_NOR.jpg
+norm windmill_001_lopatky_NOR.jpg

newmtl windmill
Ns 0.000000
Ka 1.000000 1.000000 1.000000
Kd 0.800000 0.800000 0.800000
Ks 0.000000 0.000000 0.000000
Ke 0.000000 0.000000 0.000000
Ni 1.000000
d 1.000000
illum 1
map_Kd windmill_001_base_COL.jpg
-map_Bump windmill_001_base_NOR.jpg
+norm windmill_001_base_NOR.jpg
map_Ns windmill_001_base_SPEC.jpg
</pre>
<p>and now when we load it it will be using the normal maps as normal maps and
we can see the back of the blades.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/load-obj-materials-fixed.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/load-obj-materials-fixed.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Let's load a different file.</p>
<p>Searching the net I found this <a href="https://creativecommons.org/licenses/by-nc/4.0/">CC-BY-NC</a> windmill 3D model made by <a href="http://www.gerzi.ch/">Roger Gerzner / GERIZ.3D Art</a>.</p>
<div class="threejs_center"><img src="../resources/images/windmill-obj-2.jpg"></div>

<p>It had a .OBJ version already available. Let's load it up (note I removed the .MTL loader for now)</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-  objLoader.load('resources/models/windmill/windmill.obj', ...
+  objLoader.load('resources/models/windmill-2/windmill.obj', ...
</pre>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/load-obj-wat.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/load-obj-wat.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Hmmm, nothing appears. What's the problem? I wonder what size the model is?
We can ask THREE.js what size the model is and try to set our
camera automatically.</p>
<p>First off we can ask THREE.js to compute a box that contains the scene
we just loaded and ask for its size and center</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">objLoader.load('resources/models/windmill_2/windmill.obj', (root) =&gt; {
  scene.add(root);

+  const box = new THREE.Box3().setFromObject(root);
+  const boxSize = box.getSize(new THREE.Vector3()).length();
+  const boxCenter = box.getCenter(new THREE.Vector3());
+  console.log(boxSize);
+  console.log(boxCenter);
</pre>
<p>Looking in <a href="debugging-javascript.html">the JavaScript console</a> I see</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">size 2123.6499788469982
center p {x: -0.00006103515625, y: 770.0909731090069, z: -3.313507080078125}
</pre>
<p>Our camera is currently only showing about 100 units with <code class="notranslate" translate="no">near</code> at 0.1 and <code class="notranslate" translate="no">far</code> at 100.
Our ground plane is only 40 units across so basically this windmill model is so big, 2000 units,
that it's surrounding our camera and all parts of it our outside our frustum.</p>
<div class="threejs_center"><img style="width: 280px;" src="../resources/images/camera-inside-windmill.svg"></div>

<p>We could manually fix that but we could also make the camera auto frame our scene.
Let's try that. We can then use the box we just computed adjust the camera settings to
view the entire scene. Note that there is no <em>right</em> answer
on where to put the camera. We could be facing the scene from any direction at any
altitude so we'll just have to pick something.</p>
<p>As we went over in <a href="cameras.html">the article on cameras</a> the camera defines a frustum.
That frustum is defined by the field of view (<code class="notranslate" translate="no">fov</code>) and the <code class="notranslate" translate="no">near</code> and <code class="notranslate" translate="no">far</code> settings. We
want to know given whatever field of view the camera currently has, how far away does the camera
need to be so the box containing the scene fits inside the frustum assuming the frustum
extended forever. In other words let's assume <code class="notranslate" translate="no">near</code> is 0.00000001 and <code class="notranslate" translate="no">far</code> is infinity.</p>
<p>Since we know the size of the box and we know the field of view we have this triangle</p>
<div class="threejs_center"><img style="width: 600px;" src="../resources/images/camera-fit-scene.svg"></div>

<p>You can see on the left is the camera and the blue frustum is projecting out in
front of it. We just computed the box that contains the the windmill. We need to
compute how far way the camera should be from the box so that the box appears
inside the frustum.</p>
<p>Using basic <em>right triangle</em> trigonometry and <a href="https://www.google.com/search?q=SOHCAHTOA">SOHCAHTOA</a>,
given we know the field of view for the frustum and we know the size of the box we can compute the <em>distance</em>.</p>
<div class="threejs_center"><img style="width: 600px;" src="../resources/images/field-of-view-camera.svg"></div>

<p>Based on that diagram the formula for computing distance is</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">distance = halfSizeToFitOnScreen / tangent(halfFovY)
</pre>
<p>Let's translate that to code. First let's make a function that will compute <code class="notranslate" translate="no">distance</code> and then move the
camera that <code class="notranslate" translate="no">distance</code> units from the center of the box. We'll then point the
camera at the <code class="notranslate" translate="no">center</code> of the box.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

  // compute a unit vector that points in the direction the camera is now
  // from the center of the box
  const direction = (new THREE.Vector3()).subVectors(camera.position, boxCenter).normalize();

  // move the camera to a position distance units way from the center
  // in whatever direction the camera was from the center already
  camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

  // pick some near and far values for the frustum that
  // will contain the box.
  camera.near = boxSize / 100;
  camera.far = boxSize * 100;

  camera.updateProjectionMatrix();

  // point the camera to look at the center of the box
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}
</pre>
<p>We pass in 2 sizes. The <code class="notranslate" translate="no">boxSize</code> and the <code class="notranslate" translate="no">sizeToFitOnScreen</code>. If we just passed in <code class="notranslate" translate="no">boxSize</code>
and used that as <code class="notranslate" translate="no">sizeToFitOnScreen</code> then the math would make the box fit perfectly inside
the frustum. We want a little extra space above and below so we'll pass in a slightly
larger size. </p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const objLoader = new OBJLoader();
  objLoader.load('resources/models/windmill_2/windmill.obj', (root) =&gt; {
    scene.add(root);
+    // compute the box that contains all the stuff
+    // from root and below
+    const box = new THREE.Box3().setFromObject(root);
+
+    const boxSize = box.getSize(new THREE.Vector3()).length();
+    const boxCenter = box.getCenter(new THREE.Vector3());
+
+    // set the camera to frame the box
+    frameArea(boxSize * 1.2, boxSize, boxCenter, camera);
+
+    // update the Trackball controls to handle the new size
+    controls.maxDistance = boxSize * 10;
+    controls.target.copy(boxCenter);
+    controls.update();
  });
}
</pre>
<p>You can see above we pass in <code class="notranslate" translate="no">boxSize * 1.2</code> to give us 20% more space above and below the box when trying
to fit it inside the frustum. We also updated the <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> so the camera will orbit the center
of the scene.</p>
<p>Now if we try that we get...</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/load-obj-auto-camera.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/load-obj-auto-camera.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>This almost works. Use the mouse to rotate the camera and you
should see the windmill. The problem is the windmill is large and the box's center is at about (0, 770, 0). So, when we move the camera from where it
starts (0, 10, 20) to <code class="notranslate" translate="no">distance</code> units way from the center in the direction the camera
is relative to the center that's moving the camera almost straight down below
the windmill.</p>
<div class="threejs_center"><img style="width: 360px;" src="../resources/images/computed-camera-position.svg"></div>

<p>Let's change it to move sideways from the center of the box to in whatever direction
the camera is from the center. All we need to do to do that is zero out the <code class="notranslate" translate="no">y</code> component
of the vector from the box to the camera. Then, when we normalize that vector it will
become a vector parallel to the XZ plane. In other words parallel to the ground.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-// compute a unit vector that points in the direction the camera is now
-// from the center of the box
-const direction = (new THREE.Vector3()).subVectors(camera.position, boxCenter).normalize();
+// compute a unit vector that points in the direction the camera is now
+// in the xz plane from the center of the box
+const direction = (new THREE.Vector3())
+    .subVectors(camera.position, boxCenter)
+    .multiply(new THREE.Vector3(1, 0, 1))
+    .normalize();
</pre>
<p>If you look at the bottom of the windmill you'll see a small square. That is our ground
plane. </p>
<div class="threejs_center"><img style="width: 365px;" src="../resources/images/tiny-ground-plane.jpg"></div>

<p>It's only 40x40 units and so is way too small relative to the windmill.
Since the windmill is over 2000 units big let's change the size of the ground plane to
something more fitting. We also need to adjust the repeat otherwise our checkerboard
will be so fine we won't even be able to see it unless we zoom way way in.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-const planeSize = 40;
+const planeSize = 4000;

const loader = new THREE.TextureLoader();
const texture = loader.load('resources/images/checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
-const repeats = planeSize / 2;
+const repeats = planeSize / 200;
texture.repeat.set(repeats, repeats);
</pre>
<p>and now we can see this windmill</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/load-obj-auto-camera-xz.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/load-obj-auto-camera-xz.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Let's add the materials back. Like before there is a .MTL file that references
some textures but looking at the files I quickly see an issue.</p>
<pre class="prettyprint showlinemods notranslate lang-shell" translate="no"> $ ls -l windmill
 -rw-r--r--@ 1 gregg  staff       299 May 20  2009 windmill.mtl
 -rw-r--r--@ 1 gregg  staff    142989 May 20  2009 windmill.obj
 -rw-r--r--@ 1 gregg  staff  12582956 Apr 19  2009 windmill_diffuse.tga
 -rw-r--r--@ 1 gregg  staff  12582956 Apr 20  2009 windmill_normal.tga
 -rw-r--r--@ 1 gregg  staff  12582956 Apr 19  2009 windmill_spec.tga
</pre>
<p>There are TARGA (.tga) files and they are giant!</p>
<p>THREE.js actually has a TGA loader but it's arguably wrong to use it for most use cases.
If you're making a viewer where you want to allow users to view random 3D files they
find on the net then maybe, just maybe, you might want to load TGA files. (<a href="#loading-scenes">*</a>)</p>
<p>One problem with TGA files are they can't be compressed well at all. TGA only supports very
simple compression and looking above we can see the files are not compressed at all
as the odds of them being all exactly the same size are extremely low. Further they
are 12 megabytes each!!! If we used those files the user would have to download 36meg
to see the windmill.</p>
<p>Another issue with TGA is the browser itself has no support for them so loading them
is likely going to be slower than loading supported formats like .JPG and .PNG</p>
<p>I'm pretty sure for our purposes converting them to .JPG will be the best option.
Looking inside I see they are 3 channels each, RGB, there is no alpha channel. JPG
only supports 3 channels so that's a good fit. JPG also supports lossy compression
so we can make the files much smaller to download</p>
<p>Loading the files up they were each 2048x2048. That seemed like a waste to me but of
course it depends on your use case. I made them each 1024x1024 and saved them at a
50% quality setting in Photoshop. Getting a file listing</p>
<pre class="prettyprint showlinemods notranslate lang-shell" translate="no"> $ ls -l ../threejs.org/manual/examples/resources/models/windmill
 -rw-r--r--@ 1 gregg  staff     299 May 20  2009 windmill.mtl
 -rw-r--r--@ 1 gregg  staff  142989 May 20  2009 windmill.obj
 -rw-r--r--@ 1 gregg  staff  259927 Nov  7 18:37 windmill_diffuse.jpg
 -rw-r--r--@ 1 gregg  staff   98013 Nov  7 18:38 windmill_normal.jpg
 -rw-r--r--@ 1 gregg  staff  191864 Nov  7 18:39 windmill_spec.jpg
</pre>
<p>We went from 36meg to 0.55meg! Of course the artist might not be pleased
with this compression so be sure to consult with them to discuss the tradeoffs.</p>
<p>Now, to use the .MTL file we need to edit it to reference the .JPG files
instead of the .TGA files. Fortunately it's a simple text file so it's easy to edit</p>
<pre class="prettyprint showlinemods notranslate lang-mtl" translate="no">newmtl blinn1SG
Ka 0.10 0.10 0.10

Kd 0.00 0.00 0.00
Ks 0.00 0.00 0.00
Ke 0.00 0.00 0.00
Ns 0.060000
Ni 1.500000
d 1.000000
Tr 0.000000
Tf 1.000000 1.000000 1.000000
illum 2
-map_Kd windmill_diffuse.tga
+map_Kd windmill_diffuse.jpg

-map_Ks windmill_spec.tga
+map_Ks windmill_spec.jpg

-map_bump windmill_normal.tga
-bump windmill_normal.tga
+map_bump windmill_normal.jpg
+bump windmill_normal.jpg
</pre>
<p>Now that the .MTL file points to some reasonable size textures we need to load it so we'll just do like we did above, first load the materials
and then set them on the <a href="/docs/#examples/loaders/OBJLoader"><code class="notranslate" translate="no">OBJLoader</code></a></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
+  const mtlLoader = new MTLLoader();
+  mtlLoader.load('resources/models/windmill_2/windmill-fixed.mtl', (mtl) =&gt; {
+    mtl.preload();
+    const objLoader = new OBJLoader();
+    objLoader.setMaterials(mtl);
    objLoader.load('resources/models/windmill/windmill.obj', (root) =&gt; {
      root.updateMatrixWorld();
      scene.add(root);
      // compute the box that contains all the stuff
      // from root and below
      const box = new THREE.Box3().setFromObject(root);

      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // set the camera to frame the box
      frameArea(boxSize * 1.2, boxSize, boxCenter, camera);

      // update the Trackball controls to handle the new size
      controls.maxDistance = boxSize * 10;
      controls.target.copy(boxCenter);
      controls.update();
    });
+  });
}
</pre>
<p>Before we actually try it out I ran into some issues that rather than show a failure I'm just going to go over them.</p>
<p>Issue #1: The three <a href="/docs/#examples/loaders/MTLLoader"><code class="notranslate" translate="no">MTLLoader</code></a> creates materials that multiply the material's diffuse color by the diffuse texture map.</p>
<p>That's a useful feature but looking a the .MTL file above the line</p>
<pre class="prettyprint showlinemods notranslate lang-mtl" translate="no">Kd 0.00 0.00 0.00
</pre>
<p>sets the diffuse color to 0. Texture map * 0 = black! It's possible the modeling tool used to make the windmill
did not multiply the diffuse texture map by the diffuse color. That's why it worked for the artists that made this windmill.</p>
<p>To fix this we can change the line to</p>
<pre class="prettyprint showlinemods notranslate lang-mtl" translate="no">Kd 1.00 1.00 1.00
</pre>
<p>since Texture Map * 1 = Texture Map.</p>
<p>Issue #2: The specular color is also black</p>
<p>The line that starts with <code class="notranslate" translate="no">Ks</code> specifies the specular color. It's likely the modeling software used to make the windmill
did something similar as it did with diffuse maps in that it used the specular map's color for specular highlights.
Three.js uses only the red channel of a specular map as input to how much of the specular color to reflect but three still
needs a specular color set.</p>
<p>Like above we can fix that by editing the .MTL file like this.</p>
<pre class="prettyprint showlinemods notranslate lang-mtl" translate="no">-Ks 0.00 0.00 0.00
+Ks 1.00 1.00 1.00
</pre>
<p>Issue #3: The <code class="notranslate" translate="no">windmill_normal.jpg</code> is a normal map not a bump map.</p>
<p>Just like above we just need to edit the .MTL file</p>
<pre class="prettyprint showlinemods notranslate lang-mtl" translate="no">-map_bump windmill_normal.jpg
-bump windmill_normal.jpg
+norm windmill_normal.jpg
</pre>
<p>Given all that if we now try it out it should load up with materials.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/load-obj-materials-windmill2.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/load-obj-materials-windmill2.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Loading models often runs into these kinds of issues. Common issues include:</p>
<ul>
<li><p>Needing to know the size</p>
<p>Above we made the camera try to frame the scene but that's not always the appropriate thing to do. Generally the most appropriate thing
to do is to make your own models or download the models, load them up in some 3D software and look at their scale and adjust if need be.</p>
</li>
<li><p>Orientation Wrong</p>
<p>THREE.js is generally Y = up. Some modeling packages default to Z = up, some Y = up. Some are settable.
If you run into this case where you load a model and it's on its side. You can either hack your code to rotate the model after loading (not recommended),
or you can load the model into your favorite modeling package or use some command line tools to rotate the object in the orientation you need it to be
just like you'd edit an image for your website rather than download it and apply code to adjust it. Blender even has options when you export to
change the orientation.</p>
</li>
<li><p>No .MTL file or wrong materials or incompatible parameters</p>
<p>Above we used a .MTL file above which helped us load materials but there were issues. We manually edited the .MTL file to fix.
It's also common to look inside the .OBJ file to see what materials there are, or to load the .OBJ file in THREE.js and walk the
scene and print out all the materials. Then, go modify the code to make custom materials and assign them where appropriate either
by making a name/material pair object to pass to the loader instead of loading the .MTL file, OR, after the scene has loaded, walking the
scene and fixing things.</p>
</li>
<li><p>Textures too large</p>
<p>Most 3D models are made for either architecture, movies and commercials, or
games. For architecture and movies no one really cares about the size
of the textures since. For games people care because games have limited
memory but most games run locally. Webpages though you want to load
as fast as possible and so you need to look at the textures and try
to make them as small as possible and still look good. In fact the first windmill we should arguably done something about
the textures. They are currently a total of 10meg!!!</p>
<p>Also remember
like we mentioned in the <a href="textures.html">article on textures</a> that
textures take memory so a 50k JPG that expands to 4096x4096 will download
fast but still take a ton of memory.</p>
</li>
</ul>
<p>The last thing I wanted to show is spinning the windmills. Unfortunately, .OBJ files have no hierarchy. That means all parts of each
windmill are basically considered 1 single mesh. You can't spin the blades of the mill as they aren't separated from the rest of the building.</p>
<p>This is one of the main reasons why .OBJ is not really a good format. If I was to guess, the reason it's more common than other formats
is because it's simple and doesn't support many features it works more often than not. Especially if you're making something still like
an architectural image and there's no need to animate anything it's not a bad way to get static props into a scene.</p>
<p>Next up we'll try <a href="load-gltf.html">loading a gLTF scene</a>. The gLTF format supports many more features.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# material-table.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Material Feature Table</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Material Feature Table">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Material Feature Table</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>The most common materials in three.js are the Mesh materials. Here
is a table showing which material support which features.</p>
<div>
<div id="material-table" class="threejs_center"></div>
<script type="module" src="../resources/threejs-material-table.js"></script>
<link rel="stylesheet" href="../resources/threejs-material-table.css">
</div>


        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# materials.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Materials</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Materials">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Materials</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This article is part of a series of articles about three.js. The
first article is <a href="fundamentals.html">three.js fundamentals</a>. If
you haven't read that yet and you're new to three.js you might want to
consider starting there.</p>
<p>Three.js provides several types of materials.
They define how objects will appear in the scene.
Which materials you use really depends on what you're trying to
accomplish.</p>
<p>There are 2 ways to set most material properties. One at creation time which
we've seen before.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const material = new THREE.MeshPhongMaterial({
  color: 0xFF0000,    // red (can also use a CSS color string here)
  flatShading: true,
});
</pre>
<p>The other is after creation</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const material = new THREE.MeshPhongMaterial();
material.color.setHSL(0, 1, .5);  // red
material.flatShading = true;
</pre>
<p>note that properties of type <a href="/docs/#api/en/math/Color"><code class="notranslate" translate="no">THREE.Color</code></a> have multiple ways to be set.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">material.color.set(0x00FFFF);    // same as CSS's #RRGGBB style
material.color.set(cssString);   // any CSS color, eg 'purple', '#F32',
                                 // 'rgb(255, 127, 64)',
                                 // 'hsl(180, 50%, 25%)'
material.color.set(someColor)    // some other THREE.Color
material.color.setHSL(h, s, l)   // where h, s, and l are 0 to 1
material.color.setRGB(r, g, b)   // where r, g, and b are 0 to 1
</pre>
<p>And at creation time you can pass either a hex number or a CSS string</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const m1 = new THREE.MeshBasicMaterial({color: 0xFF0000});         // red
const m2 = new THREE.MeshBasicMaterial({color: 'red'});            // red
const m3 = new THREE.MeshBasicMaterial({color: '#F00'});           // red
const m4 = new THREE.MeshBasicMaterial({color: 'rgb(255,0,0)'});   // red
const m5 = new THREE.MeshBasicMaterial({color: 'hsl(0,100%,50%)'}); // red
</pre>
<p>So let's go over three.js's set of materials.</p>
<p>The <a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a> is not affected by lights.
The <a href="/docs/#api/en/materials/MeshLambertMaterial"><code class="notranslate" translate="no">MeshLambertMaterial</code></a> computes lighting only at the vertices vs the <a href="/docs/#api/en/materials/MeshPhongMaterial"><code class="notranslate" translate="no">MeshPhongMaterial</code></a> which computes lighting at every pixel. The <a href="/docs/#api/en/materials/MeshPhongMaterial"><code class="notranslate" translate="no">MeshPhongMaterial</code></a>
also supports specular highlights.</p>
<div class="spread">
  <div>
    <div data-diagram="MeshBasicMaterial"></div>
    <div class="code">Basic</div>
  </div>
  <div>
    <div data-diagram="MeshLambertMaterial"></div>
    <div class="code">Lambert</div>
  </div>
  <div>
    <div data-diagram="MeshPhongMaterial"></div>
    <div class="code">Phong</div>
  </div>
</div>
<div class="spread">
  <div>
    <div data-diagram="MeshBasicMaterialLowPoly"></div>
  </div>
  <div>
    <div data-diagram="MeshLambertMaterialLowPoly"></div>
  </div>
  <div>
    <div data-diagram="MeshPhongMaterialLowPoly"></div>
  </div>
</div>
<div class="threejs_center code">low-poly models with same materials</div>

<p>The <code class="notranslate" translate="no">shininess</code> setting of the <a href="/docs/#api/en/materials/MeshPhongMaterial"><code class="notranslate" translate="no">MeshPhongMaterial</code></a> determines the <em>shininess</em> of the specular highlight. It defaults to 30.</p>
<div class="spread">
  <div>
    <div data-diagram="MeshPhongMaterialShininess0"></div>
    <div class="code">shininess: 0</div>
  </div>
  <div>
    <div data-diagram="MeshPhongMaterialShininess30"></div>
    <div class="code">shininess: 30</div>
  </div>
  <div>
    <div data-diagram="MeshPhongMaterialShininess150"></div>
    <div class="code">shininess: 150</div>
  </div>
</div>

<p>Note that setting the <code class="notranslate" translate="no">emissive</code> property to a color on either a
<a href="/docs/#api/en/materials/MeshLambertMaterial"><code class="notranslate" translate="no">MeshLambertMaterial</code></a> or a <a href="/docs/#api/en/materials/MeshPhongMaterial"><code class="notranslate" translate="no">MeshPhongMaterial</code></a> and setting the <code class="notranslate" translate="no">color</code> to black
(and <code class="notranslate" translate="no">shininess</code> to 0 for phong) ends up looking just like the <a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a>.</p>
<div class="spread">
  <div>
    <div data-diagram="MeshBasicMaterialCompare"></div>
    <div class="code">
      <div>Basic</div>
      <div>color: 'purple'</div>
    </div>
  </div>
  <div>
    <div data-diagram="MeshLambertMaterialCompare"></div>
    <div class="code">
      <div>Lambert</div>
      <div>color: 'black'</div>
      <div>emissive: 'purple'</div>
    </div>
  </div>
  <div>
    <div data-diagram="MeshPhongMaterialCompare"></div>
    <div class="code">
      <div>Phong</div>
      <div>color: 'black'</div>
      <div>emissive: 'purple'</div>
      <div>shininess: 0</div>
    </div>
  </div>
</div>

<p>Why have all 3 when <a href="/docs/#api/en/materials/MeshPhongMaterial"><code class="notranslate" translate="no">MeshPhongMaterial</code></a> can do the same things as <a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a>
and <a href="/docs/#api/en/materials/MeshLambertMaterial"><code class="notranslate" translate="no">MeshLambertMaterial</code></a>? The reason is the more sophisticated material
takes more GPU power to draw. On a slower GPU like say a mobile phone
you might want to reduce the GPU power needed to draw your scene by
using one of the less complex materials. It also follows that if you
don't need the extra features then use the simplest material. If you don't
need the lighting and the specular highlight then use the <a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a>.</p>
<p>The <a href="/docs/#api/en/materials/MeshToonMaterial"><code class="notranslate" translate="no">MeshToonMaterial</code></a> is similar to the <a href="/docs/#api/en/materials/MeshPhongMaterial"><code class="notranslate" translate="no">MeshPhongMaterial</code></a>
with one big difference. Rather than shading smoothly it uses a gradient map
(an X by 1 texture) to decide how to shade. The default uses a gradient map
that is 70% brightness for the first 70% and 100% after but you can supply your
own gradient map. This ends up giving a 2 tone look that looks like a cartoon.</p>
<div class="spread">
  <div data-diagram="MeshToonMaterial"></div>
</div>

<p>Next up there are 2 <em>physically based rendering</em> materials. Physically Based
Rendering is often abbreviated PBR.</p>
<p>The materials above use simple math to make materials that look 3D but they
aren't what actually happens in real world. The 2 PBR materials use much more
complex math to come close to what actually happens in the real world.</p>
<p>The first one is <a href="/docs/#api/en/materials/MeshStandardMaterial"><code class="notranslate" translate="no">MeshStandardMaterial</code></a>. The biggest difference between
<a href="/docs/#api/en/materials/MeshPhongMaterial"><code class="notranslate" translate="no">MeshPhongMaterial</code></a> and <a href="/docs/#api/en/materials/MeshStandardMaterial"><code class="notranslate" translate="no">MeshStandardMaterial</code></a> is it uses different parameters.
<a href="/docs/#api/en/materials/MeshPhongMaterial"><code class="notranslate" translate="no">MeshPhongMaterial</code></a> had a <code class="notranslate" translate="no">shininess</code> setting. <a href="/docs/#api/en/materials/MeshStandardMaterial"><code class="notranslate" translate="no">MeshStandardMaterial</code></a> has 2
settings <code class="notranslate" translate="no">roughness</code> and <code class="notranslate" translate="no">metalness</code>.</p>
<p>At a basic level <a href="/docs/#api/en/materials/MeshStandardMaterial#roughness"><code class="notranslate" translate="no">roughness</code></a> is the opposite
of <code class="notranslate" translate="no">shininess</code>. Something that has a high roughness, like a baseball doesn't
have hard reflections whereas something that's not rough, like a billiard ball,
is very shiny. Roughness goes from 0 to 1.</p>
<p>The other setting, <a href="/docs/#api/en/materials/MeshStandardMaterial#metalness"><code class="notranslate" translate="no">metalness</code></a>, says
how metal the material is. Metals behave differently than non-metals. 0
for non-metal and 1 for metal.</p>
<p>Here's a quick sample of <a href="/docs/#api/en/materials/MeshStandardMaterial"><code class="notranslate" translate="no">MeshStandardMaterial</code></a> with <code class="notranslate" translate="no">roughness</code> from 0 to 1
across and <code class="notranslate" translate="no">metalness</code> from 0 to 1 down.</p>
<div data-diagram="MeshStandardMaterial" style="min-height: 400px"></div>

<p>The <a href="/docs/#api/en/materials/MeshPhysicalMaterial"><code class="notranslate" translate="no">MeshPhysicalMaterial</code></a> is same as the <a href="/docs/#api/en/materials/MeshStandardMaterial"><code class="notranslate" translate="no">MeshStandardMaterial</code></a> but it
adds a <code class="notranslate" translate="no">clearcoat</code> parameter that goes from 0 to 1 for how much to
apply a clearcoat gloss layer and a <code class="notranslate" translate="no">clearCoatRoughness</code> parameter
that specifies how rough the gloss layer is.</p>
<p>Here's the same grid of <code class="notranslate" translate="no">roughness</code> by <code class="notranslate" translate="no">metalness</code> as above but with
<code class="notranslate" translate="no">clearcoat</code> and <code class="notranslate" translate="no">clearCoatRoughness</code> settings.</p>
<div data-diagram="MeshPhysicalMaterial" style="min-height: 400px"></div>

<p>The various standard materials progress from fastest to slowest
<a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a> ➡ <a href="/docs/#api/en/materials/MeshLambertMaterial"><code class="notranslate" translate="no">MeshLambertMaterial</code></a> ➡ <a href="/docs/#api/en/materials/MeshPhongMaterial"><code class="notranslate" translate="no">MeshPhongMaterial</code></a> ➡
<a href="/docs/#api/en/materials/MeshStandardMaterial"><code class="notranslate" translate="no">MeshStandardMaterial</code></a> ➡ <a href="/docs/#api/en/materials/MeshPhysicalMaterial"><code class="notranslate" translate="no">MeshPhysicalMaterial</code></a>. The slower materials
can make more realistic looking scenes but you might need to design
your code to use the faster materials on low powered or mobile machines.</p>
<p>There are 3 materials that have special uses. <a href="/docs/#api/en/materials/ShadowMaterial"><code class="notranslate" translate="no">ShadowMaterial</code></a>
is used to get the data created from shadows. We haven't
covered shadows yet. When we do we'll use this material
to take a peek at what's happening behind the scenes.</p>
<p>The <a href="/docs/#api/en/materials/MeshDepthMaterial"><code class="notranslate" translate="no">MeshDepthMaterial</code></a> renders the depth of each pixel where
pixels at negative <a href="/docs/#api/en/cameras/PerspectiveCamera#near"><code class="notranslate" translate="no">near</code></a> of the camera are 0 and negative <a href="/docs/#api/en/cameras/PerspectiveCamera#far"><code class="notranslate" translate="no">far</code></a> are 1. Certain special effects can use this data which we'll
get into at another time.</p>
<div class="spread">
  <div>
    <div data-diagram="MeshDepthMaterial"></div>
  </div>
</div>

<p>The <a href="/docs/#api/en/materials/MeshNormalMaterial"><code class="notranslate" translate="no">MeshNormalMaterial</code></a> will show you the <em>normals</em> of geometry.
<em>Normals</em> are the direction a particular triangle or pixel faces.
<a href="/docs/#api/en/materials/MeshNormalMaterial"><code class="notranslate" translate="no">MeshNormalMaterial</code></a> draws the view space normals (the normals relative to the camera).
<span style="background: red;" class="color">x is red</span>,
<span style="background: green;" class="dark-color">y is green</span>, and
<span style="background: blue;" class="dark-color">z is blue</span> so things facing
to the right will be <span style="background: #FF7F7F;" class="color">pink</span>,
to the left will be <span style="background: #007F7F;" class="dark-color">aqua</span>,
up will be <span style="background: #7FFF7F;" class="color">light green</span>,
down will be <span style="background: #7F007F;" class="dark-color">purple</span>,
and toward the screen will be <span style="background: #7F7FFF;" class="color">lavender</span>.</p>
<div class="spread">
  <div>
    <div data-diagram="MeshNormalMaterial"></div>
  </div>
</div>

<p><a href="/docs/#api/en/materials/ShaderMaterial"><code class="notranslate" translate="no">ShaderMaterial</code></a> is for making custom materials using the three.js shader
system. <a href="/docs/#api/en/materials/RawShaderMaterial"><code class="notranslate" translate="no">RawShaderMaterial</code></a> is for making entirely custom shaders with
no help from three.js. Both of these topics are large and will be
covered later.</p>
<p>Most materials share a bunch of settings all defined by <a href="/docs/#api/en/materials/Material"><code class="notranslate" translate="no">Material</code></a>.
<a href="/docs/#api/en/materials/Material">See the docs</a>
for all of them but let's go over two of the most commonly used
properties.</p>
<p><a href="/docs/#api/en/materials/Material#flatShading"><code class="notranslate" translate="no">flatShading</code></a>:
whether or not the object looks faceted or smooth. default = <code class="notranslate" translate="no">false</code>.</p>
<div class="spread">
  <div>
    <div data-diagram="smoothShading"></div>
    <div class="code">flatShading: false</div>
  </div>
  <div>
    <div data-diagram="flatShading"></div>
    <div class="code">flatShading: true</div>
  </div>
</div>

<p><a href="/docs/#api/en/materials/Material#side"><code class="notranslate" translate="no">side</code></a>: which sides of triangles to show. The default is <code class="notranslate" translate="no">THREE.FrontSide</code>.
Other options are <code class="notranslate" translate="no">THREE.BackSide</code> and <code class="notranslate" translate="no">THREE.DoubleSide</code> (both sides).
Most 3D objects drawn in three are probably opaque solids so the back sides
(the sides facing inside the solid) do not need to be drawn. The most common
reason to set <code class="notranslate" translate="no">side</code> is for planes or other non-solid objects where it is
common to see the back sides of triangles.</p>
<p>Here are 6 planes drawn with <code class="notranslate" translate="no">THREE.FrontSide</code> and <code class="notranslate" translate="no">THREE.DoubleSide</code>.</p>
<div class="spread">
  <div>
    <div data-diagram="sideDefault" style="height: 250px;"></div>
    <div class="code">side: THREE.FrontSide</div>
  </div>
  <div>
    <div data-diagram="sideDouble" style="height: 250px;"></div>
    <div class="code">side: THREE.DoubleSide</div>
  </div>
</div>

<p>There's really a lot to consider with materials and we actually still
have a bunch more to go. In particular we've mostly ignored textures
which open up a whole slew of options. Before we cover textures though
we need to take a break and cover
<a href="setup.html">setting up your development environment</a></p>
<div class="threejs_bottombar">
<h3>material.needsUpdate</h3>
<p>
This topic rarely affects most three.js apps but just as an FYI...
Three.js applies material settings when a material is used where "used"
means "something is rendered that uses the material". Some material settings are
only applied once as changing them requires lots of work by three.js.
In those cases you need to set <code class="notranslate" translate="no">material.needsUpdate = true</code> to tell
three.js to apply your material changes. The most common settings
that require you to set <code class="notranslate" translate="no">needsUpdate</code> if you change the settings after
using the material are:
</p>
<ul>
  <li><code class="notranslate" translate="no">flatShading</code></li>
  <li>adding or removing a texture
    <p>
    Changing a texture is ok, but if want to switch from using no texture
    to using a texture or from using a texture to using no texture
    then you need to set <code class="notranslate" translate="no">needsUpdate = true</code>.
    </p>
    <p>In the case of going from texture to no-texture it is often
    just better to use a 1x1 pixel white texture.</p>
  </li>
</ul>
<p>As mentioned above most apps never run into these issues. Most apps
do not switch between flat shaded and non flat shaded. Most apps also
either use textures or a solid color for a given material, they rarely
switch from using one to using the other.
</p>
</div>

<p><canvas id="c"></canvas></p>
<script type="module" src="../resources/threejs-materials.js"></script>


        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# multiple-scenes.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Multiple Canvases Multiple Scenes</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Multiple Canvases Multiple Scenes">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Multiple Canvases Multiple Scenes</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>A common question is how to use THREE.js with multiple canvases.
Let's say you want to make an e-commerce site or you want to make
a page with lots of 3D diagrams. At first glance it appears easy.
Just make a canvas every where you want a diagram. For each canvas
make a <a href="/docs/#api/en/constants/Renderer"><code class="notranslate" translate="no">Renderer</code></a>.</p>
<p>You'll quickly find though that you run into problems.</p>
<ol>
<li><p>The browser limits how many WebGL contexts you can have.</p>
<p>Typically that limit is around 8 of them. As soon as you create
the 9th context the oldest one will be lost.</p>
</li>
<li><p>WebGL resources can not be shared across contexts</p>
<p>That means if you want to load a 10 meg model into 2 canvases
and that model uses 20 meg of textures your 10 meg model will
have to be loaded twice and your textures will also be loaded
twice. Nothing can be shared across contexts. This also
means things have to be initialized twice, shaders compiled twice,
etc. It gets worse as there are more canvases.</p>
</li>
</ol>
<p>So what's the solution?</p>
<p>The solution is one canvas that fills the viewport in the background and some other element to represent each "virtual" canvas. We make a single <a href="/docs/#api/en/constants/Renderer"><code class="notranslate" translate="no">Renderer</code></a> and then one <a href="/docs/#api/en/scenes/Scene"><code class="notranslate" translate="no">Scene</code></a> for each virtual canvas. We'll then check the positions of the virtual canvas elements and if they are on the screen we'll tell THREE.js to draw their scene at the correct place.</p>
<p>With this solution there is only 1 canvas so we solve both problem 1
and 2 above. We won't run into the WebGL context limit because we
will only be using one context. We also won't run into the sharing
issues for the same reasons.</p>
<p>Let's start with a simple example with just 2 scenes. First we'll
make the HTML</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;canvas id="c"&gt;&lt;/canvas&gt;
&lt;p&gt;
  &lt;span id="box" class="diagram left"&gt;&lt;/span&gt;
  I love boxes. Presents come in boxes.
  When I find a new box I'm always excited to find out what's inside.
&lt;/p&gt;
&lt;p&gt;
  &lt;span id="pyramid" class="diagram right"&gt;&lt;/span&gt;
  When I was a kid I dreamed of going on an expedition inside a pyramid
  and finding a undiscovered tomb full of mummies and treasure.
&lt;/p&gt;
</pre>
<p>Then we can setup the CSS maybe something like this</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">#c {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: -1;
}
.diagram {
  display: inline-block;
  width: 5em;
  height: 3em;
  border: 1px solid black;
}
.left {
  float: left;
  margin-right: .25em;
}
.right {
  float: right;
  margin-left: .25em;
}
</pre>
<p>We set the canvas to fill the screen and we set its <code class="notranslate" translate="no">z-index</code> to
-1 to make it appear behind other elements. We also need to specify some kind of width and height for our virtual canvas elements since there is nothing inside to give them any size.</p>
<p>Now we'll make 2 scenes each with a light and a camera.
To one scene we'll add a cube and to another a diamond.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function makeScene(elem) {
  const scene = new THREE.Scene();

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
  camera.position.set(0, 1, 2);
  camera.lookAt(0, 0, 0);

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  return {scene, camera, elem};
}

function setupScene1() {
  const sceneInfo = makeScene(document.querySelector('#box'));
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({color: 'red'});
  const mesh = new THREE.Mesh(geometry, material);
  sceneInfo.scene.add(mesh);
  sceneInfo.mesh = mesh;
  return sceneInfo;
}

function setupScene2() {
  const sceneInfo = makeScene(document.querySelector('#pyramid'));
  const radius = .8;
  const widthSegments = 4;
  const heightSegments = 2;
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const material = new THREE.MeshPhongMaterial({
    color: 'blue',
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  sceneInfo.scene.add(mesh);
  sceneInfo.mesh = mesh;
  return sceneInfo;
}

const sceneInfo1 = setupScene1();
const sceneInfo2 = setupScene2();
</pre>
<p>And then we'll make a function to render each scene
only if the element is on the screen. We can tell THREE.js
to only render to part of the canvas by turning on the <em>scissor</em>
test with <a href="/docs/#api/en/constants/Renderer.setScissorTest"><code class="notranslate" translate="no">Renderer.setScissorTest</code></a> and then setting both the scissor and the viewport with <a href="/docs/#api/en/constants/Renderer.setViewport"><code class="notranslate" translate="no">Renderer.setViewport</code></a> and <a href="/docs/#api/en/constants/Renderer.setScissor"><code class="notranslate" translate="no">Renderer.setScissor</code></a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function renderSceneInfo(sceneInfo) {
  const {scene, camera, elem} = sceneInfo;

  // get the viewport relative position of this element
  const {left, right, top, bottom, width, height} =
      elem.getBoundingClientRect();

  const isOffscreen =
      bottom &lt; 0 ||
      top &gt; renderer.domElement.clientHeight ||
      right &lt; 0 ||
      left &gt; renderer.domElement.clientWidth;

  if (isOffscreen) {
    return;
  }

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  const positiveYUpBottom = canvasRect.height - bottom;
  renderer.setScissor(left, positiveYUpBottom, width, height);
  renderer.setViewport(left, positiveYUpBottom, width, height);

  renderer.render(scene, camera);
}
</pre>
<p>And then our render function will just first clear the screen
and then render each scene.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {
  time *= 0.001;

  resizeRendererToDisplaySize(renderer);

  renderer.setScissorTest(false);
  renderer.clear(true, true);
  renderer.setScissorTest(true);

  sceneInfo1.mesh.rotation.y = time * .1;
  sceneInfo2.mesh.rotation.y = time * .1;

  renderSceneInfo(sceneInfo1);
  renderSceneInfo(sceneInfo2);

  requestAnimationFrame(render);
}
</pre>
<p>And here it is</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/multiple-scenes-v1.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/multiple-scenes-v1.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>You can see where the first <code class="notranslate" translate="no">&lt;span&gt;</code> is there's a red cube and where the second <code class="notranslate" translate="no">span</code> is there's a blue diamond.</p>
<h2 id="syncing-up">Syncing up</h2>
<p>The code above works but there is one minor issue.
If your scenes are complicated or if for whatever reason
it takes too long to render, the position of the scenes
drawn into the canvas will lag behind the rest of the page.</p>
<p>If we give each area a border </p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">.diagram {
  display: inline-block;
  width: 5em;
  height: 3em;
+  border: 1px solid black;
}
</pre>
<p>And we set the background of each scene</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const scene = new THREE.Scene();
+scene.background = new THREE.Color('red');
</pre>
<p>And if we <a href="../examples/multiple-scenes-v2.html" target="_blank">quickly scroll up and down</a> we'll see the issue. Here's a animation of scrolling slowed down by 10x.</p>
<div class="threejs_center"><img class="border" src="../resources/images/multi-view-skew.gif"></div>

<p>We can switch to a different method which has a different tradeoff. We'll switch the canvas's CSS from <code class="notranslate" translate="no">position: fixed</code> to <code class="notranslate" translate="no">position: absolute</code>. </p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">#c {
-  position: fixed;
+  position: absolute;
</pre>
<p>Then we'll set the canvas's transform to move it so
the top of the canvas is at the top of whatever part
the page is currently scrolled to.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {
  ...

  const transform = `translateY(${window.scrollY}px)`;
  renderer.domElement.style.transform = transform;
</pre>
<p><code class="notranslate" translate="no">position: fixed</code> kept the canvas from scrolling at all
while the rest of the page scrolled over it. <code class="notranslate" translate="no">position: absolute</code> will let the canvas scroll with the rest of the page which means whatever we draw will stick with the page as it scrolls even if we're too slow to render. When we finally get a chance to render then we move the canvas so it matches where the page has been scrolled and then we re-render. This means only the edges of the window will show some un-rendered bits for a moment but <a href="../examples/multiple-scenes-v2.html" target="_blank">the stuff in the middle of the page should match up</a> and not slide. Here's a view of the results of the new method slowed down 10x.</p>
<div class="threejs_center"><img class="border" src="../resources/images/multi-view-fixed.gif"></div>

<h2 id="making-it-more-generic">Making it more Generic</h2>
<p>Now that we've gotten multiple scenes working let's make this just slightly more generic.</p>
<p>We could make it so the main render function, the one managing the canvas, just has a list of elements and their associated render function. For each element it would check if the element is on screen and if so call the corresponding render function. In this way we'd have a generic system where individual scenes aren't really aware they are being rendered in some smaller space.</p>
<p>Here's the main render function</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const sceneElements = [];
function addScene(elem, fn) {
  sceneElements.push({elem, fn});
}

function render(time) {
  time *= 0.001;

  resizeRendererToDisplaySize(renderer);

  renderer.setScissorTest(false);
  renderer.setClearColor(clearColor, 0);
  renderer.clear(true, true);
  renderer.setScissorTest(true);

  const transform = `translateY(${window.scrollY}px)`;
  renderer.domElement.style.transform = transform;

  for (const {elem, fn} of sceneElements) {
    // get the viewport relative position of this element
    const rect = elem.getBoundingClientRect();
    const {left, right, top, bottom, width, height} = rect;

    const isOffscreen =
        bottom &lt; 0 ||
        top &gt; renderer.domElement.clientHeight ||
        right &lt; 0 ||
        left &gt; renderer.domElement.clientWidth;

    if (!isOffscreen) {
      const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
      renderer.setScissor(left, positiveYUpBottom, width, height);
      renderer.setViewport(left, positiveYUpBottom, width, height);

      fn(time, rect);
    }
  }

  requestAnimationFrame(render);
}
</pre>
<p>You can see it loops over <code class="notranslate" translate="no">sceneElements</code> which it expects is an array of objects each of which have an <code class="notranslate" translate="no">elem</code> and <code class="notranslate" translate="no">fn</code> property.</p>
<p>It checks if the element is on screen. If it is it calls <code class="notranslate" translate="no">fn</code> and passes it the current time and its rectangle.</p>
<p>Now the setup code for each scene just adds itself to the list of scenes</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const elem = document.querySelector('#box');
  const {scene, camera} = makeScene();
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({color: 'red'});
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  addScene(elem, (time, rect) =&gt; {
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    mesh.rotation.y = time * .1;
    renderer.render(scene, camera);
  });
}

{
  const elem = document.querySelector('#pyramid');
  const {scene, camera} = makeScene();
  const radius = .8;
  const widthSegments = 4;
  const heightSegments = 2;
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const material = new THREE.MeshPhongMaterial({
    color: 'blue',
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  addScene(elem, (time, rect) =&gt; {
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    mesh.rotation.y = time * .1;
    renderer.render(scene, camera);
  });
}
</pre>
<p>With that we no longer need <code class="notranslate" translate="no">sceneInfo1</code> and <code class="notranslate" translate="no">sceneInfo2</code> and the code that was rotating the meshes is now specific to each scene.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/multiple-scenes-generic.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/multiple-scenes-generic.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<h2 id="using-html-dataset">Using HTML Dataset</h2>
<p>One last even more generic thing we can do is use HTML <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset">dataset</a>. This is a way to add your own data to an HTML element. Instead of using <code class="notranslate" translate="no">id="..."</code> we'll use <code class="notranslate" translate="no">data-diagram="..."</code> like this</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;canvas id="c"&gt;&lt;/canvas&gt;
&lt;p&gt;
-  &lt;span id="box" class="diagram left"&gt;&lt;/span&gt;
+  &lt;span data-diagram="box" class="left"&gt;&lt;/span&gt;
  I love boxes. Presents come in boxes.
  When I find a new box I'm always excited to find out what's inside.
&lt;/p&gt;
&lt;p&gt;
-  &lt;span id="pyramid" class="diagram left"&gt;&lt;/span&gt;
+  &lt;span data-diagram="pyramid" class="right"&gt;&lt;/span&gt;
  When I was a kid I dreamed of going on an expedition inside a pyramid
  and finding a undiscovered tomb full of mummies and treasure.
&lt;/p&gt;
</pre>
<p>We can them change the CSS selector to select for that</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">-.diagram
+*[data-diagram] {
  display: inline-block;
  width: 5em;
  height: 3em;
}
</pre>
<p>We'll change the scene setup code to just be a map of names to <em>scene initialization functions</em> that return a <em>scene render function</em>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const sceneInitFunctionsByName = {
  'box': () =&gt; {
    const {scene, camera} = makeScene();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({color: 'red'});
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return (time, rect) =&gt; {
      mesh.rotation.y = time * .1;
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
  },
  'pyramid': () =&gt; {
    const {scene, camera} = makeScene();
    const radius = .8;
    const widthSegments = 4;
    const heightSegments = 2;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const material = new THREE.MeshPhongMaterial({
      color: 'blue',
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return (time, rect) =&gt; {
      mesh.rotation.y = time * .1;
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
  },
};
</pre>
<p>And to init we can just use <code class="notranslate" translate="no">querySelectorAll</code> to find all the diagrams and call the corresponding init function for that diagram. </p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">document.querySelectorAll('[data-diagram]').forEach((elem) =&gt; {
  const sceneName = elem.dataset.diagram;
  const sceneInitFunction = sceneInitFunctionsByName[sceneName];
  const sceneRenderFunction = sceneInitFunction(elem);
  addScene(elem, sceneRenderFunction);
});
</pre>
<p>No change to the visuals but the code is even more generic.</p>
<p></p>
<h2 id="adding-controls-to-each-element">Adding Controls to each element</h2>
<p>Adding interactively, for example a <code class="notranslate" translate="no">TrackballControls</code> is just as easy. First we add the script for the control.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import {TrackballControls} from 'three/addons/controls/TrackballControls.js';
</pre>
<p>And then we can add a <code class="notranslate" translate="no">TrackballControls</code> to each scene passing in the element associated with that scene.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-function makeScene() {
+function makeScene(elem) {
  const scene = new THREE.Scene();

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 1, 2);
  camera.lookAt(0, 0, 0);
+  scene.add(camera);

+  const controls = new TrackballControls(camera, elem);
+  controls.noZoom = true;
+  controls.noPan = true;

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
-    scene.add(light);
+    camera.add(light);
  }

-  return {scene, camera};
+ return {scene, camera, controls};
}
</pre>
<p>You'll notice we added the camera to the scene and the light to the camera. This makes the light relative to the camera. Since the <code class="notranslate" translate="no">TrackballControls</code> are moving the camera this is probably what we want. It keeps the light shining on the side of the object we are looking at.</p>
<p>We need up update those controls in our render functions</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const sceneInitFunctionsByName = {
- 'box': () =&gt; {
-    const {scene, camera} = makeScene();
+ 'box': (elem) =&gt; {
+    const {scene, camera, controls} = makeScene(elem);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({color: 'red'});
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return (time, rect) =&gt; {
      mesh.rotation.y = time * .1;
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
+      controls.handleResize();
+      controls.update();
      renderer.render(scene, camera);
    };
  },
-  'pyramid': () =&gt; {
-    const {scene, camera} = makeScene();
+  'pyramid': (elem) =&gt; {
+    const {scene, camera, controls} = makeScene(elem);
    const radius = .8;
    const widthSegments = 4;
    const heightSegments = 2;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const material = new THREE.MeshPhongMaterial({
      color: 'blue',
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return (time, rect) =&gt; {
      mesh.rotation.y = time * .1;
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
+      controls.handleResize();
+      controls.update();
      renderer.render(scene, camera);
    };
  },
};
</pre>
<p>And now if you drag the objects they'll rotate.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/multiple-scenes-controls.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/multiple-scenes-controls.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>These techniques are used on this site itself. In particular <a href="primitives.html">the article about primitives</a> and <a href="materials.html">the article about materials</a> use this technique to add the various examples throughout the article.</p>
<p>One more solution would be to render to an off screen canvas and copy the result to a 2D canvas at each element.
The advantage to this solution is there is no limit on how you can composite each separate area. With the previous
solution we and a single canvas in the background. With this solution we have normal HTML elements.</p>
<p>The disadvantage is it's slower because a copy has to happen for each area. How much slower depends on the browser
and the GPU.</p>
<p>The changes needed are pretty small</p>
<p>First we'll change HTML as we no longer need a canvas in the page</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;body&gt;
-  &lt;canvas id="c"&gt;&lt;/canvas&gt;
  ...
&lt;/body&gt;
</pre>
<p>then we'll change the CSS</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">-#c {
-  position: absolute;
-  left: 0;
-  top: 0;
-  width: 100%;
-  height: 100%;
-  display: block;
-  z-index: -1;
-}
canvas {
  width: 100%;
  height: 100%;
  display: block;
}
*[data-diagram] {
  display: inline-block;
  width: 5em;
  height: 3em;
}
</pre><p>We've made all canvases fill their container.</p>
<p>Now let's change the JavaScript. First we no longer
look up the canvas. Instead we create one. We also
just turn on the scissor test at the beginning.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function main() {
-  const canvas = document.querySelector('#c');
+  const canvas = document.createElement('canvas');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas, alpha: true});
+  renderer.setScissorTest(true);

  ...
</pre>
<p>Then for each scene we create a 2D rendering context and
append its canvas to the element for that scene</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const sceneElements = [];
function addScene(elem, fn) {
+  const ctx = document.createElement('canvas').getContext('2d');
+  elem.appendChild(ctx.canvas);
-  sceneElements.push({elem, fn});
+  sceneElements.push({elem, ctx, fn});
}
</pre>
<p>Then when rendering, if the renderer's canvas is not
big enough to render this area we increase its size.
As well if this area's canvas is the wrong size we
change its size. Finally we set the scissor and viewport,
render the scene for this area, then copy the result to the area's canvas.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {
  time *= 0.001;

-  resizeRendererToDisplaySize(renderer);
-
-  renderer.setScissorTest(false);
-  renderer.setClearColor(clearColor, 0);
-  renderer.clear(true, true);
-  renderer.setScissorTest(true);
-
-  const transform = `translateY(${window.scrollY}px)`;
-  renderer.domElement.style.transform = transform;

-  for (const {elem, fn} of sceneElements) {
+  for (const {elem, fn, ctx} of sceneElements) {
    // get the viewport relative position of this element
    const rect = elem.getBoundingClientRect();
    const {left, right, top, bottom, width, height} = rect;
+    const rendererCanvas = renderer.domElement;

    const isOffscreen =
        bottom &lt; 0 ||
-        top &gt; renderer.domElement.clientHeight ||
+        top &gt; window.innerHeight ||
        right &lt; 0 ||
-        left &gt; renderer.domElement.clientWidth;
+        left &gt; window.innerWidth;

    if (!isOffscreen) {
-      const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
-      renderer.setScissor(left, positiveYUpBottom, width, height);
-      renderer.setViewport(left, positiveYUpBottom, width, height);

+      // make sure the renderer's canvas is big enough
+      if (rendererCanvas.width &lt; width || rendererCanvas.height &lt; height) {
+        renderer.setSize(width, height, false);
+      }
+
+      // make sure the canvas for this area is the same size as the area
+      if (ctx.canvas.width !== width || ctx.canvas.height !== height) {
+        ctx.canvas.width = width;
+        ctx.canvas.height = height;
+      }
+
+      renderer.setScissor(0, 0, width, height);
+      renderer.setViewport(0, 0, width, height);

      fn(time, rect);

+      // copy the rendered scene to this element's canvas
+      ctx.globalCompositeOperation = 'copy';
+      ctx.drawImage(
+          rendererCanvas,
+          0, rendererCanvas.height - height, width, height,  // src rect
+          0, 0, width, height);                              // dst rect
    }
  }

  requestAnimationFrame(render);
}
</pre>
<p>The result looks the same</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/multiple-scenes-copy-canvas.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/multiple-scenes-copy-canvas.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>One other advantage to this solution is you could potentially use
<a href="https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas"><code class="notranslate" translate="no">OffscreenCanvas</code></a>
to render from a web worker and still use this technique. Unfortunately as of July 2020
<code class="notranslate" translate="no">OffscreenCanvas</code> is only supported by Chrome.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# offscreencanvas.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>OffscreenCanvas</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – OffscreenCanvas">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>OffscreenCanvas</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p><a href="https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas"><code class="notranslate" translate="no">OffscreenCanvas</code></a>
is a relatively new browser feature currently only available in Chrome but apparently
coming to other browsers. <code class="notranslate" translate="no">OffscreenCanvas</code> allows a web worker to render
to a canvas. This is a way to offload heavy work, like rendering a complex 3D scene,
to a web worker so as not to slow down the responsiveness of the browser. It
also means data is loaded and parsed in the worker so possibly less jank while
the page loads.</p>
<p>Getting <em>started</em> using it is pretty straight forward. Let's port the 3 spinning cube
example from <a href="responsive.html">the article on responsiveness</a>.</p>
<p>Workers generally have their code separated
into another script file whereas most of the examples on this site have had
their scripts embedded into the HTML file of the page they are on.</p>
<p>In our case we'll make a file called <code class="notranslate" translate="no">offscreencanvas-cubes.js</code> and
copy all the JavaScript from <a href="responsive.html">the responsive example</a> into it. We'll then
make the changes needed for it to run in a worker.</p>
<p>We still need some JavaScript in our HTML file. The first thing
we need to do there is look up the canvas and then transfer control of that
canvas to be offscreen by calling <code class="notranslate" translate="no">canvas.transferControlToOffscreen</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function main() {
  const canvas = document.querySelector('#c');
  const offscreen = canvas.transferControlToOffscreen();

  ...
</pre>
<p>We can then start our worker with <code class="notranslate" translate="no">new Worker(pathToScript, {type: 'module'})</code>.
and pass the <code class="notranslate" translate="no">offscreen</code> object to it.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function main() {
  const canvas = document.querySelector('#c');
  const offscreen = canvas.transferControlToOffscreen();
  const worker = new Worker('offscreencanvas-cubes.js', {type: 'module'});
  worker.postMessage({type: 'main', canvas: offscreen}, [offscreen]);
}
main();
</pre>
<p>It's important to note that workers can't access the <code class="notranslate" translate="no">DOM</code>. They
can't look at HTML elements nor can they receive mouse events or
keyboard events. The only thing they can generally do is respond
to messages sent to them and send messages back to the page.</p>
<p>To send a message to a worker we call <a href="https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage"><code class="notranslate" translate="no">worker.postMessage</code></a> and
pass it 1 or 2 arguments. The first argument is a JavaScript object
that will be <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm">cloned</a>
and sent to the worker. The second argument is an optional array
of objects that are part of the first object that we want <em>transferred</em>
to the worker. These objects will not be cloned. Instead they will be <em>transferred</em>
and will cease to exist in the main page. Cease to exist is the probably
the wrong description, rather they are neutered. Only certain types of
objects can be transferred instead of cloned. They include <code class="notranslate" translate="no">OffscreenCanvas</code>
so once transferred the <code class="notranslate" translate="no">offscreen</code> object back in the main page is useless.</p>
<p>Workers receive messages from their <code class="notranslate" translate="no">onmessage</code> handler. The object
we passed to <code class="notranslate" translate="no">postMessage</code> arrives on <code class="notranslate" translate="no">event.data</code> passed to the <code class="notranslate" translate="no">onmessage</code>
handler on the worker. The code above declares a <code class="notranslate" translate="no">type: 'main'</code> in the object it passes
to the worker. This object has no meaning to the browser. It's entirely for
our own usage. We'll make a handler that based on <code class="notranslate" translate="no">type</code> calls
a different function in the worker. Then we can add functions as
needed and easily call them from the main page.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const handlers = {
  main,
};

self.onmessage = function(e) {
  const fn = handlers[e.data.type];
  if (typeof fn !== 'function') {
    throw new Error('no handler for type: ' + e.data.type);
  }
  fn(e.data);
};
</pre>
<p>You can see above we just look up the handler based on the <code class="notranslate" translate="no">type</code> pass it the <code class="notranslate" translate="no">data</code>
that was sent from the main page.</p>
<p>So now we just need to start changing the <code class="notranslate" translate="no">main</code> we pasted into
<code class="notranslate" translate="no">offscreencanvas-cubes.js</code> from <a href="responsive.html">the responsive article</a>.</p>
<p>Instead of looking up the canvas from the DOM we'll receive it from the
event data.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-function main() {
-  const canvas = document.querySelector('#c');
+function main(data) {
+  const {canvas} = data;
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

  ...
</pre>
<p>Remembering that workers can't see the DOM at all the first problem
we run into is <code class="notranslate" translate="no">resizeRendererToDisplaySize</code> can't look at <code class="notranslate" translate="no">canvas.clientWidth</code>
and <code class="notranslate" translate="no">canvas.clientHeight</code> as those are DOM values. Here's the original code</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
</pre>
<p>Instead we'll need to send sizes as they change to the worker.
So, let's add some global state and keep the width and height there.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const state = {
  width: 300,  // canvas default
  height: 150,  // canvas default
};
</pre>
<p>Then let's add a <code class="notranslate" translate="no">'size'</code> handler to update those values. </p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+function size(data) {
+  state.width = data.width;
+  state.height = data.height;
+}

const handlers = {
  main,
+  size,
};
</pre>
<p>Now we can change <code class="notranslate" translate="no">resizeRendererToDisplaySize</code> to use <code class="notranslate" translate="no">state.width</code> and <code class="notranslate" translate="no">state.height</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
-  const width = canvas.clientWidth;
-  const height = canvas.clientHeight;
+  const width = state.width;
+  const height = state.height;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
</pre>
<p>and where we compute the aspect we need similar changes</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {
  time *= 0.001;

  if (resizeRendererToDisplaySize(renderer)) {
-    camera.aspect = canvas.clientWidth / canvas.clientHeight;
+    camera.aspect = state.width / state.height;
    camera.updateProjectionMatrix();
  }

  ...
</pre>
<p>Back in the main page we'll send a <code class="notranslate" translate="no">size</code> event anytime the page changes size.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const worker = new Worker('offscreencanvas-picking.js', {type: 'module'});
worker.postMessage({type: 'main', canvas: offscreen}, [offscreen]);

+function sendSize() {
+  worker.postMessage({
+    type: 'size',
+    width: canvas.clientWidth,
+    height: canvas.clientHeight,
+  });
+}
+
+window.addEventListener('resize', sendSize);
+sendSize();
</pre>
<p>We also call it once to send the initial size.</p>
<p>And with just those few changes, assuming your browser fully supports <code class="notranslate" translate="no">OffscreenCanvas</code>
it should work. Before we run it though let's check if the browser actually supports
<code class="notranslate" translate="no">OffscreenCanvas</code> and if not display an error. First let's add some HTML to display the error.</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;body&gt;
  &lt;canvas id="c"&gt;&lt;/canvas&gt;
+  &lt;div id="noOffscreenCanvas" style="display:none;"&gt;
+    &lt;div&gt;no OffscreenCanvas support&lt;/div&gt;
+  &lt;/div&gt;
&lt;/body&gt;
</pre>
<p>and some CSS for that</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">#noOffscreenCanvas {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    background: red;
    color: white;
}
</pre>
<p>and then we can check for the existence of <code class="notranslate" translate="no">transferControlToOffscreen</code> to see
if the browser supports <code class="notranslate" translate="no">OffscreenCanvas</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function main() {
  const canvas = document.querySelector('#c');
+  if (!canvas.transferControlToOffscreen) {
+    canvas.style.display = 'none';
+    document.querySelector('#noOffscreenCanvas').style.display = '';
+    return;
+  }
  const offscreen = canvas.transferControlToOffscreen();
  const worker = new Worker('offscreencanvas-picking.js', {type: 'module});
  worker.postMessage({type: 'main', canvas: offscreen}, [offscreen]);

  ...
</pre>
<p>and with that, if your browser supports <code class="notranslate" translate="no">OffscreenCanvas</code> this example should work</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/offscreencanvas.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/offscreencanvas.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>So that's great but since not every browser supports <code class="notranslate" translate="no">OffscreenCanvas</code> at the moment
let's change the code to work with both <code class="notranslate" translate="no">OffscreenCanvas</code> and if not then fallback to using
the canvas in the main page like normal.</p>
<blockquote>
<p>As an aside, if you need OffscreenCanvas to make your page responsive then
it's not clear what the point of having a fallback is. Maybe based on if
you end up running on the main page or in a worker you might adjust the amount
of work done so that when running in a worker you can do more than when
running in the main page. What you do is really up to you.</p>
</blockquote>
<p>The first thing we should probably do is separate out the three.js
code from the code that is specific to the worker. That way we can
use the same code on both the main page and the worker. In other words
we will now have 3 files</p>
<ol>
<li><p>our html file.</p>
<p><code class="notranslate" translate="no">threejs-offscreencanvas-w-fallback.html</code></p>
</li>
<li><p>a JavaScript that contains our three.js code.</p>
<p><code class="notranslate" translate="no">shared-cubes.js</code></p>
</li>
<li><p>our worker support code</p>
<p><code class="notranslate" translate="no">offscreencanvas-worker-cubes.js</code></p>
</li>
</ol>
<p><code class="notranslate" translate="no">shared-cubes.js</code> and <code class="notranslate" translate="no">offscreencanvas-worker-cubes.js</code> are basically
the split of our previous <code class="notranslate" translate="no">offscreencanvas-cubes.js</code> file. First we
copy all of <code class="notranslate" translate="no">offscreencanvas-cubes.js</code> to <code class="notranslate" translate="no">shared-cube.js</code>. Then
we rename <code class="notranslate" translate="no">main</code> to <code class="notranslate" translate="no">init</code> since we already have a <code class="notranslate" translate="no">main</code> in our
HTML file and we need to export <code class="notranslate" translate="no">init</code> and <code class="notranslate" translate="no">state</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import * as THREE from 'three';

-const state = {
+export const state = {
  width: 300,   // canvas default
  height: 150,  // canvas default
};

-function main(data) {
+export function init(data) {
  const {canvas} = data;
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
</pre>
<p>and cut out the just the non three.js relates parts</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-function size(data) {
-  state.width = data.width;
-  state.height = data.height;
-}
-
-const handlers = {
-  main,
-  size,
-};
-
-self.onmessage = function(e) {
-  const fn = handlers[e.data.type];
-  if (typeof fn !== 'function') {
-    throw new Error('no handler for type: ' + e.data.type);
-  }
-  fn(e.data);
-};
</pre>
<p>Then we copy those parts we just deleted to <code class="notranslate" translate="no">offscreencanvas-worker-cubes.js</code>
and import <code class="notranslate" translate="no">shared-cubes.js</code> as well as call <code class="notranslate" translate="no">init</code> instead of <code class="notranslate" translate="no">main</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import {init, state} from './shared-cubes.js';

function size(data) {
  state.width = data.width;
  state.height = data.height;
}

const handlers = {
-  main,
+  init,
  size,
};

self.onmessage = function(e) {
  const fn = handlers[e.data.type];
  if (typeof fn !== 'function') {
    throw new Error('no handler for type: ' + e.data.type);
  }
  fn(e.data);
};
</pre>
<p>Similarly we need to include <code class="notranslate" translate="no">shared-cubes.js</code> in the main page</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;script type="module"&gt;
+import {init, state} from './shared-cubes.js';
</pre>
<p>We can remove the HTML and CSS we added previously</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;body&gt;
  &lt;canvas id="c"&gt;&lt;/canvas&gt;
-  &lt;div id="noOffscreenCanvas" style="display:none;"&gt;
-    &lt;div&gt;no OffscreenCanvas support&lt;/div&gt;
-  &lt;/div&gt;
&lt;/body&gt;
</pre>
<p>and some CSS for that</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">-#noOffscreenCanvas {
-    display: flex;
-    width: 100%;
-    height: 100%;
-    align-items: center;
-    justify-content: center;
-    background: red;
-    color: white;
-}
</pre>
<p>Then let's change the code in the main page to call one start
function or another depending on if the browser supports <code class="notranslate" translate="no">OffscreenCanvas</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function main() {
  const canvas = document.querySelector('#c');
-  if (!canvas.transferControlToOffscreen) {
-    canvas.style.display = 'none';
-    document.querySelector('#noOffscreenCanvas').style.display = '';
-    return;
-  }
-  const offscreen = canvas.transferControlToOffscreen();
-  const worker = new Worker('offscreencanvas-picking.js', {type: 'module'});
-  worker.postMessage({type: 'main', canvas: offscreen}, [offscreen]);
+  if (canvas.transferControlToOffscreen) {
+    startWorker(canvas);
+  } else {
+    startMainPage(canvas);
+  }
  ...
</pre>
<p>We'll move all the code we had to setup the worker inside <code class="notranslate" translate="no">startWorker</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function startWorker(canvas) {
  const offscreen = canvas.transferControlToOffscreen();
  const worker = new Worker('offscreencanvas-worker-cubes.js', {type: 'module'});
  worker.postMessage({type: 'main', canvas: offscreen}, [offscreen]);

  function sendSize() {
    worker.postMessage({
      type: 'size',
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    });
  }

  window.addEventListener('resize', sendSize);
  sendSize();

  console.log('using OffscreenCanvas');
}
</pre>
<p>and send <code class="notranslate" translate="no">init</code> instead of <code class="notranslate" translate="no">main</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-  worker.postMessage({type: 'main', canvas: offscreen}, [offscreen]);
+  worker.postMessage({type: 'init', canvas: offscreen}, [offscreen]);
</pre>
<p>for starting in the main page we can do this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function startMainPage(canvas) {
  init({canvas});

  function sendSize() {
    state.width = canvas.clientWidth;
    state.height = canvas.clientHeight;
  }
  window.addEventListener('resize', sendSize);
  sendSize();

  console.log('using regular canvas');
}
</pre>
<p>and with that our example will run either in an OffscreenCanvas or
fallback to running in the main page.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/offscreencanvas-w-fallback.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/offscreencanvas-w-fallback.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>So that was relatively easy. Let's try picking. We'll take some code from
the <code class="notranslate" translate="no">RayCaster</code> example from <a href="picking.html">the article on picking</a>
and make it work offscreen.</p>
<p>Let's copy the <code class="notranslate" translate="no">shared-cube.js</code> to <code class="notranslate" translate="no">shared-picking.js</code> and add the
picking parts. We copy in the <code class="notranslate" translate="no">PickHelper</code> </p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(normalizedPosition, scene, camera, time) {
    // restore the color if there is a picked object
    if (this.pickedObject) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }

    // cast a ray through the frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      this.pickedObject = intersectedObjects[0].object;
      // save its color
      this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
      // set its emissive color to flashing red/yellow
      this.pickedObject.material.emissive.setHex((time * 8) % 2 &gt; 1 ? 0xFFFF00 : 0xFF0000);
    }
  }
}

const pickPosition = {x: 0, y: 0};
const pickHelper = new PickHelper();
</pre>
<p>We updated <code class="notranslate" translate="no">pickPosition</code> from the mouse like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
  };
}

function setPickPosition(event) {
  const pos = getCanvasRelativePosition(event);
  pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
  pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
}
window.addEventListener('mousemove', setPickPosition);
</pre>
<p>A worker can't read the mouse position directly so just like the size code
let's send a message with the mouse position. Like the size code we'll
send the mouse position and update <code class="notranslate" translate="no">pickPosition</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function size(data) {
  state.width = data.width;
  state.height = data.height;
}

+function mouse(data) {
+  pickPosition.x = data.x;
+  pickPosition.y = data.y;
+}

const handlers = {
  init,
+  mouse,
  size,
};

self.onmessage = function(e) {
  const fn = handlers[e.data.type];
  if (typeof fn !== 'function') {
    throw new Error('no handler for type: ' + e.data.type);
  }
  fn(e.data);
};
</pre>
<p>Back in our main page we need to add code to pass the mouse
to the worker or the main page.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+let sendMouse;

function startWorker(canvas) {
  const offscreen = canvas.transferControlToOffscreen();
  const worker = new Worker('offscreencanvas-worker-picking.js', {type: 'module'});
  worker.postMessage({type: 'init', canvas: offscreen}, [offscreen]);

+  sendMouse = (x, y) =&gt; {
+    worker.postMessage({
+      type: 'mouse',
+      x,
+      y,
+    });
+  };

  function sendSize() {
    worker.postMessage({
      type: 'size',
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    });
  }

  window.addEventListener('resize', sendSize);
  sendSize();

  console.log('using OffscreenCanvas');  /* eslint-disable-line no-console */
}

function startMainPage(canvas) {
  init({canvas});

+  sendMouse = (x, y) =&gt; {
+    pickPosition.x = x;
+    pickPosition.y = y;
+  };

  function sendSize() {
    state.width = canvas.clientWidth;
    state.height = canvas.clientHeight;
  }
  window.addEventListener('resize', sendSize);
  sendSize();

  console.log('using regular canvas');  /* eslint-disable-line no-console */
}
</pre>
<p>Then we can copy in all the mouse handling code to the main page and
make just minor changes to use <code class="notranslate" translate="no">sendMouse</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function setPickPosition(event) {
  const pos = getCanvasRelativePosition(event);
-  pickPosition.x = (pos.x / canvas.clientWidth ) *  2 - 1;
-  pickPosition.y = (pos.y / canvas.clientHeight) * -2 + 1;  // note we flip Y
+  sendMouse(
+      (pos.x / canvas.clientWidth ) *  2 - 1,
+      (pos.y / canvas.clientHeight) * -2 + 1);  // note we flip Y
}

function clearPickPosition() {
  // unlike the mouse which always has a position
  // if the user stops touching the screen we want
  // to stop picking. For now we just pick a value
  // unlikely to pick something
-  pickPosition.x = -100000;
-  pickPosition.y = -100000;
+  sendMouse(-100000, -100000);
}
window.addEventListener('mousemove', setPickPosition);
window.addEventListener('mouseout', clearPickPosition);
window.addEventListener('mouseleave', clearPickPosition);

window.addEventListener('touchstart', (event) =&gt; {
  // prevent the window from scrolling
  event.preventDefault();
  setPickPosition(event.touches[0]);
}, {passive: false});

window.addEventListener('touchmove', (event) =&gt; {
  setPickPosition(event.touches[0]);
});

window.addEventListener('touchend', clearPickPosition);
</pre>
<p>and with that picking should be working with <code class="notranslate" translate="no">OffscreenCanvas</code>.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/offscreencanvas-w-picking.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/offscreencanvas-w-picking.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Let's take it one more step and add in the <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a>.
This will be little more involved. The <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> use
the DOM pretty extensively checking the mouse, touch events,
and the keyboard.</p>
<p>Unlike our code so far we can't really use a global <code class="notranslate" translate="no">state</code> object
without re-writing all the OrbitControls code to work with it.
The OrbitControls take an <code class="notranslate" translate="no">HTMLElement</code> to which they attach most
of the DOM events they use. Maybe we could pass in our own
object that has the same API surface as a DOM element.
We only need to support the features the OrbitControls need.</p>
<p>Digging through the <a href="https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/OrbitControls.js">OrbitControls source code</a>
it looks like we need to handle the following events.</p>
<ul>
<li>contextmenu</li>
<li>pointerdown</li>
<li>pointermove</li>
<li>pointerup</li>
<li>touchstart</li>
<li>touchmove</li>
<li>touchend</li>
<li>wheel</li>
<li>keydown</li>
</ul>
<p>For the pointer events we need the <code class="notranslate" translate="no">ctrlKey</code>, <code class="notranslate" translate="no">metaKey</code>, <code class="notranslate" translate="no">shiftKey</code>,
<code class="notranslate" translate="no">button</code>, <code class="notranslate" translate="no">pointerType</code>, <code class="notranslate" translate="no">clientX</code>, <code class="notranslate" translate="no">clientY</code>, <code class="notranslate" translate="no">pageX</code>, and <code class="notranslate" translate="no">pageY</code>, properties.</p>
<p>For the keydown events we need the <code class="notranslate" translate="no">ctrlKey</code>, <code class="notranslate" translate="no">metaKey</code>, <code class="notranslate" translate="no">shiftKey</code>,
and <code class="notranslate" translate="no">keyCode</code> properties.</p>
<p>For the wheel event we only need the <code class="notranslate" translate="no">deltaY</code> property.</p>
<p>And for the touch events we only need <code class="notranslate" translate="no">pageX</code> and <code class="notranslate" translate="no">pageY</code> from
the <code class="notranslate" translate="no">touches</code> property.</p>
<p>So, let's make a proxy object pair. One part will run in the main page,
get all those events, and pass on the relevant property values
to the worker. The other part will run in the worker, receive those
events and pass them on using events that have the same structure
as the original DOM events so the OrbitControls won't be able to
tell the difference.</p>
<p>Here's the code for the worker part.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import {EventDispatcher} from 'three';

class ElementProxyReceiver extends EventDispatcher {
  constructor() {
    super();
  }
  handleEvent(data) {
    this.dispatchEvent(data);
  }
}
</pre>
<p>All it does is if it receives a message it dispatches it.
It inherits from <a href="/docs/#api/en/core/EventDispatcher"><code class="notranslate" translate="no">EventDispatcher</code></a> which provides methods like
<code class="notranslate" translate="no">addEventListener</code> and <code class="notranslate" translate="no">removeEventListener</code> just like a DOM
element so if we pass it to the OrbitControls it should work.</p>
<p><code class="notranslate" translate="no">ElementProxyReceiver</code> handles 1 element. In our case we only need
one but it's best to think head so lets make a manager to manage
more than one of them.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ProxyManager {
  constructor() {
    this.targets = {};
    this.handleEvent = this.handleEvent.bind(this);
  }
  makeProxy(data) {
    const {id} = data;
    const proxy = new ElementProxyReceiver();
    this.targets[id] = proxy;
  }
  getProxy(id) {
    return this.targets[id];
  }
  handleEvent(data) {
    this.targets[data.id].handleEvent(data.data);
  }
}
</pre>
<p>We can make a instance of <code class="notranslate" translate="no">ProxyManager</code> and call its <code class="notranslate" translate="no">makeProxy</code>
method with an id which will make an <code class="notranslate" translate="no">ElementProxyReceiver</code> that
responds to messages with that id.</p>
<p>Let's hook it up to our worker's message handler.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const proxyManager = new ProxyManager();

function start(data) {
  const proxy = proxyManager.getProxy(data.canvasId);
  init({
    canvas: data.canvas,
    inputElement: proxy,
  });
}

function makeProxy(data) {
  proxyManager.makeProxy(data);
}

...

const handlers = {
-  init,
-  mouse,
+  start,
+  makeProxy,
+  event: proxyManager.handleEvent,
   size,
};

self.onmessage = function(e) {
  const fn = handlers[e.data.type];
  if (typeof fn !== 'function') {
    throw new Error('no handler for type: ' + e.data.type);
  }
  fn(e.data);
};
</pre>
<p>In our shared three.js code we need to import the <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> and set them up.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import * as THREE from 'three';
+import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

export function init(data) {
-  const {canvas} = data;
+  const {canvas, inputElement} = data;
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

+  const controls = new OrbitControls(camera, inputElement);
+  controls.target.set(0, 0, 0);
+  controls.update();
</pre>
<p>Notice we're passing the OrbitControls our proxy via <code class="notranslate" translate="no">inputElement</code>
instead of passing in the canvas like we do in other non-OffscreenCanvas
examples.</p>
<p>Next we can move all the picking event code from the HTML file
to the shared three.js code as well while changing
<code class="notranslate" translate="no">canvas</code> to <code class="notranslate" translate="no">inputElement</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function getCanvasRelativePosition(event) {
-  const rect = canvas.getBoundingClientRect();
+  const rect = inputElement.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function setPickPosition(event) {
  const pos = getCanvasRelativePosition(event);
-  sendMouse(
-      (pos.x / canvas.clientWidth ) *  2 - 1,
-      (pos.y / canvas.clientHeight) * -2 + 1);  // note we flip Y
+  pickPosition.x = (pos.x / inputElement.clientWidth ) *  2 - 1;
+  pickPosition.y = (pos.y / inputElement.clientHeight) * -2 + 1;  // note we flip Y
}

function clearPickPosition() {
  // unlike the mouse which always has a position
  // if the user stops touching the screen we want
  // to stop picking. For now we just pick a value
  // unlikely to pick something
-  sendMouse(-100000, -100000);
+  pickPosition.x = -100000;
+  pickPosition.y = -100000;
}

*inputElement.addEventListener('mousemove', setPickPosition);
*inputElement.addEventListener('mouseout', clearPickPosition);
*inputElement.addEventListener('mouseleave', clearPickPosition);

*inputElement.addEventListener('touchstart', (event) =&gt; {
  // prevent the window from scrolling
  event.preventDefault();
  setPickPosition(event.touches[0]);
}, {passive: false});

*inputElement.addEventListener('touchmove', (event) =&gt; {
  setPickPosition(event.touches[0]);
});

*inputElement.addEventListener('touchend', clearPickPosition);
</pre>
<p>Back in the main page we need code to send messages for
all the events we enumerated above.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">let nextProxyId = 0;
class ElementProxy {
  constructor(element, worker, eventHandlers) {
    this.id = nextProxyId++;
    this.worker = worker;
    const sendEvent = (data) =&gt; {
      this.worker.postMessage({
        type: 'event',
        id: this.id,
        data,
      });
    };

    // register an id
    worker.postMessage({
      type: 'makeProxy',
      id: this.id,
    });
    for (const [eventName, handler] of Object.entries(eventHandlers)) {
      element.addEventListener(eventName, function(event) {
        handler(event, sendEvent);
      });
    }
  }
}
</pre>
<p><code class="notranslate" translate="no">ElementProxy</code> takes the element who's events we want to proxy. It
then registers an id with the worker by picking one and sending it
via the <code class="notranslate" translate="no">makeProxy</code> message we setup earlier. The worker will make
an <code class="notranslate" translate="no">ElementProxyReceiver</code> and register it to that id.</p>
<p>We then have an object of event handlers to register. This way
we can pass handlers only for these events we want to forward to
the worker.</p>
<p>When we start the worker we first make a proxy and pass in our event handlers.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function startWorker(canvas) {
  const offscreen = canvas.transferControlToOffscreen();
  const worker = new Worker('offscreencanvas-worker-orbitcontrols.js', {type: 'module'});

+  const eventHandlers = {
+    contextmenu: preventDefaultHandler,
+    mousedown: mouseEventHandler,
+    mousemove: mouseEventHandler,
+    mouseup: mouseEventHandler,
+    pointerdown: mouseEventHandler,
+    pointermove: mouseEventHandler,
+    pointerup: mouseEventHandler,
+    touchstart: touchEventHandler,
+    touchmove: touchEventHandler,
+    touchend: touchEventHandler,
+    wheel: wheelEventHandler,
+    keydown: filteredKeydownEventHandler,
+  };
+  const proxy = new ElementProxy(canvas, worker, eventHandlers);
  worker.postMessage({
    type: 'start',
    canvas: offscreen,
+    canvasId: proxy.id,
  }, [offscreen]);
  console.log('using OffscreenCanvas');  /* eslint-disable-line no-console */
}
</pre>
<p>And here are the event handlers. All they do is copy a list of properties
from the event they receive. They are passed a <code class="notranslate" translate="no">sendEvent</code> function to which they pass the data
they make. That function will add the correct id and send it to the worker.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const mouseEventHandler = makeSendPropertiesHandler([
  'ctrlKey',
  'metaKey',
  'shiftKey',
  'button',
  'pointerType',
  'clientX',
  'clientY',
  'pageX',
  'pageY',
]);
const wheelEventHandlerImpl = makeSendPropertiesHandler([
  'deltaX',
  'deltaY',
]);
const keydownEventHandler = makeSendPropertiesHandler([
  'ctrlKey',
  'metaKey',
  'shiftKey',
  'keyCode',
]);

function wheelEventHandler(event, sendFn) {
  event.preventDefault();
  wheelEventHandlerImpl(event, sendFn);
}

function preventDefaultHandler(event) {
  event.preventDefault();
}

function copyProperties(src, properties, dst) {
  for (const name of properties) {
      dst[name] = src[name];
  }
}

function makeSendPropertiesHandler(properties) {
  return function sendProperties(event, sendFn) {
    const data = {type: event.type};
    copyProperties(event, properties, data);
    sendFn(data);
  };
}

function touchEventHandler(event, sendFn) {
  const touches = [];
  const data = {type: event.type, touches};
  for (let i = 0; i &lt; event.touches.length; ++i) {
    const touch = event.touches[i];
    touches.push({
      pageX: touch.pageX,
      pageY: touch.pageY,
    });
  }
  sendFn(data);
}

// The four arrow keys
const orbitKeys = {
  '37': true,  // left
  '38': true,  // up
  '39': true,  // right
  '40': true,  // down
};
function filteredKeydownEventHandler(event, sendFn) {
  const {keyCode} = event;
  if (orbitKeys[keyCode]) {
    event.preventDefault();
    keydownEventHandler(event, sendFn);
  }
}
</pre>
<p>This seems close to running but if we actually try it we'll see
that the <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> need a few more things.</p>
<p>One is they call <code class="notranslate" translate="no">element.focus</code>. We don't need that to happen
in the worker so let's just add a stub.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ElementProxyReceiver extends THREE.EventDispatcher {
  constructor() {
    super();
  }
  handleEvent(data) {
    this.dispatchEvent(data);
  }
+  focus() {
+    // no-op
+  }
}
</pre>
<p>Another is they call <code class="notranslate" translate="no">event.preventDefault</code> and <code class="notranslate" translate="no">event.stopPropagation</code>.
We're already handling that in the main page so those can also be a noop.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+function noop() {
+}

class ElementProxyReceiver extends THREE.EventDispatcher {
  constructor() {
    super();
  }
  handleEvent(data) {
+    data.preventDefault = noop;
+    data.stopPropagation = noop;
    this.dispatchEvent(data);
  }
  focus() {
    // no-op
  }
}
</pre>
<p>Another is they look at <code class="notranslate" translate="no">clientWidth</code> and <code class="notranslate" translate="no">clientHeight</code>. We
were passing the size before but we can update the proxy pair
to pass that as well.</p>
<p>In the worker...</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ElementProxyReceiver extends THREE.EventDispatcher {
  constructor() {
    super();
  }
+  get clientWidth() {
+    return this.width;
+  }
+  get clientHeight() {
+    return this.height;
+  }
+  getBoundingClientRect() {
+    return {
+      left: this.left,
+      top: this.top,
+      width: this.width,
+      height: this.height,
+      right: this.left + this.width,
+      bottom: this.top + this.height,
+    };
+  }
  handleEvent(data) {
+    if (data.type === 'size') {
+      this.left = data.left;
+      this.top = data.top;
+      this.width = data.width;
+      this.height = data.height;
+      return;
+    }
    data.preventDefault = noop;
    data.stopPropagation = noop;
    this.dispatchEvent(data);
  }
  focus() {
    // no-op
  }
}
</pre>
<p>back in the main page we need to send the size and the left and top positions as well.
Note that as is we don't handle if the canvas moves, only if it resizes. If you wanted
to handle moving you'd need to call <code class="notranslate" translate="no">sendSize</code> anytime something moved the canvas.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ElementProxy {
  constructor(element, worker, eventHandlers) {
    this.id = nextProxyId++;
    this.worker = worker;
    const sendEvent = (data) =&gt; {
      this.worker.postMessage({
        type: 'event',
        id: this.id,
        data,
      });
    };

    // register an id
    worker.postMessage({
      type: 'makeProxy',
      id: this.id,
    });
+    sendSize();
    for (const [eventName, handler] of Object.entries(eventHandlers)) {
      element.addEventListener(eventName, function(event) {
        handler(event, sendEvent);
      });
    }

+    function sendSize() {
+      const rect = element.getBoundingClientRect();
+      sendEvent({
+        type: 'size',
+        left: rect.left,
+        top: rect.top,
+        width: element.clientWidth,
+        height: element.clientHeight,
+      });
+    }
+
+    window.addEventListener('resize', sendSize);
  }
}
</pre>
<p>and in our shared three.js code we no longer need <code class="notranslate" translate="no">state</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-export const state = {
-  width: 300,   // canvas default
-  height: 150,  // canvas default
-};

...

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
-  const width = state.width;
-  const height = state.height;
+  const width = inputElement.clientWidth;
+  const height = inputElement.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function render(time) {
  time *= 0.001;

  if (resizeRendererToDisplaySize(renderer)) {
-    camera.aspect = state.width / state.height;
+    camera.aspect = inputElement.clientWidth / inputElement.clientHeight;
    camera.updateProjectionMatrix();
  }

  ...
</pre>
<p>A few more hacks. The OrbitControls add <code class="notranslate" translate="no">pointermove</code> and <code class="notranslate" translate="no">pointerup</code> events to the
<code class="notranslate" translate="no">ownerDocument</code> of the element to handle mouse capture (when the mouse goes
outside the window).</p>
<p>Further the code references the global <code class="notranslate" translate="no">document</code> but there is no global document
in a worker. </p>
<p>We can solve all of these with a 2 quick hacks. In our worker
code we'll re-use our proxy for both problems.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function start(data) {
  const proxy = proxyManager.getProxy(data.canvasId);
+  proxy.ownerDocument = proxy; // HACK!
+  self.document = {} // HACK!
  init({
    canvas: data.canvas,
    inputElement: proxy,
  });
}
</pre>
<p>This will give the <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> something to inspect which
matches their expectations.</p>
<p>I know that was kind of hard to follow. The short version is:
<code class="notranslate" translate="no">ElementProxy</code> runs on the main page and forwards DOM events
to <code class="notranslate" translate="no">ElementProxyReceiver</code> in the worker which
masquerades as an <code class="notranslate" translate="no">HTMLElement</code> that we can use both with the
<a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> and with our own code.</p>
<p>The final thing is our fallback when we are not using OffscreenCanvas.
All we have to do is pass the canvas itself as our <code class="notranslate" translate="no">inputElement</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function startMainPage(canvas) {
-  init({canvas});
+  init({canvas, inputElement: canvas});
  console.log('using regular canvas');
}
</pre>
<p>and now we should have OrbitControls working with OffscreenCanvas</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/offscreencanvas-w-orbitcontrols.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/offscreencanvas-w-orbitcontrols.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>This is probably the most complicated example on this site. It's a
little hard to follow because there are 3 files involved for each
sample. The HTML file, the worker file, the shared three.js code.</p>
<p>I hope it wasn't too difficult to understand and that it provided some
useful examples of working with three.js, OffscreenCanvas and web workers.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# optimize-lots-of-objects-animated.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Optimize Lots of Objects Animated</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Optimize Lots of Objects Animated">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Optimize Lots of Objects Animated</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This article is a continuation of <a href="optimize-lots-of-objects.html">an article about optimizing lots of objects
</a>. If you haven't read that
yet please read it before proceeding. </p>
<p>In the previous article we merged around 19000 cubes into a
single geometry. This had the advantage that it optimized our drawing
of 19000 cubes but it had the disadvantage of make it harder to
move any individual cube.</p>
<p>Depending on what we are trying to accomplish there are different solutions.
In this case let's graph multiple sets of data and animate between the sets.</p>
<p>The first thing we need to do is get multiple sets of data. Ideally we'd
probably pre-process data offline but in this case let's load 2 sets of
data and generate 2 more</p>
<p>Here's our old loading code</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">loadFile('resources/data/gpw/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc')
  .then(parseData)
  .then(addBoxes)
  .then(render);
</pre>
<p>Let's change it to something like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">async function loadData(info) {
  const text = await loadFile(info.url);
  info.file = parseData(text);
}

async function loadAll() {
  const fileInfos = [
    {name: 'men',   hueRange: [0.7, 0.3], url: 'resources/data/gpw/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc' },
    {name: 'women', hueRange: [0.9, 1.1], url: 'resources/data/gpw/gpw_v4_basic_demographic_characteristics_rev10_a000_014ft_2010_cntm_1_deg.asc' },
  ];

  await Promise.all(fileInfos.map(loadData));

  ...
}
loadAll();
</pre>
<p>The code above will load all the files in <code class="notranslate" translate="no">fileInfos</code> and when done each object
in <code class="notranslate" translate="no">fileInfos</code> will have a <code class="notranslate" translate="no">file</code> property with the loaded file. <code class="notranslate" translate="no">name</code> and <code class="notranslate" translate="no">hueRange</code>
we'll use later. <code class="notranslate" translate="no">name</code> will be for a UI field. <code class="notranslate" translate="no">hueRange</code> will be used to
choose a range of hues to map over.</p>
<p>The two files above are apparently the number of men per area and the number of
women per area as of 2010. Note, I have no idea if this data is correct but
it's not important really. The important part is showing different sets
of data.</p>
<p>Let's generate 2 more sets of data. One being the places where the number
men are greater than the number of women and visa versa, the places where
the number of women are greater than the number of men. </p>
<p>The first thing let's write a function that given a 2 dimensional array
of arrays like we had before will map over it to generate a new 2 dimensional
array of arrays</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function mapValues(data, fn) {
  return data.map((row, rowNdx) =&gt; {
    return row.map((value, colNdx) =&gt; {
      return fn(value, rowNdx, colNdx);
    });
  });
}
</pre>
<p>Like the normal <code class="notranslate" translate="no">Array.map</code> function the <code class="notranslate" translate="no">mapValues</code> function calls a function
<code class="notranslate" translate="no">fn</code> for each value in the array of arrays. It passes it the value and both the
row and column indices.</p>
<p>Now let's make some code to generate a new file that is a comparison between 2
files</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function makeDiffFile(baseFile, otherFile, compareFn) {
  let min;
  let max;
  const baseData = baseFile.data;
  const otherData = otherFile.data;
  const data = mapValues(baseData, (base, rowNdx, colNdx) =&gt; {
    const other = otherData[rowNdx][colNdx];
      if (base === undefined || other === undefined) {
        return undefined;
      }
      const value = compareFn(base, other);
      min = Math.min(min === undefined ? value : min, value);
      max = Math.max(max === undefined ? value : max, value);
      return value;
  });
  // make a copy of baseFile and replace min, max, and data
  // with the new data
  return {...baseFile, min, max, data};
}
</pre>
<p>The code above uses <code class="notranslate" translate="no">mapValues</code> to generate a new set of data that is
a comparison based on the <code class="notranslate" translate="no">compareFn</code> function passed in. It also tracks
the <code class="notranslate" translate="no">min</code> and <code class="notranslate" translate="no">max</code> comparison results. Finally it makes a new file with
all the same properties as <code class="notranslate" translate="no">baseFile</code> except with a new <code class="notranslate" translate="no">min</code>, <code class="notranslate" translate="no">max</code> and <code class="notranslate" translate="no">data</code>.</p>
<p>Then let's use that to make 2 new sets of data</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const menInfo = fileInfos[0];
  const womenInfo = fileInfos[1];
  const menFile = menInfo.file;
  const womenFile = womenInfo.file;

  function amountGreaterThan(a, b) {
    return Math.max(a - b, 0);
  }
  fileInfos.push({
    name: '&gt;50%men',
    hueRange: [0.6, 1.1],
    file: makeDiffFile(menFile, womenFile, (men, women) =&gt; {
      return amountGreaterThan(men, women);
    }),
  });
  fileInfos.push({
    name: '&gt;50% women',
    hueRange: [0.0, 0.4],
    file: makeDiffFile(womenFile, menFile, (women, men) =&gt; {
      return amountGreaterThan(women, men);
    }),
  });
}
</pre>
<p>Now let's generate a UI to select between these sets of data. First we need
some UI html</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;body&gt;
  &lt;canvas id="c"&gt;&lt;/canvas&gt;
+  &lt;div id="ui"&gt;&lt;/div&gt;
&lt;/body&gt;
</pre>
<p>and some CSS to make it appear in the top left area</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">#ui {
  position: absolute;
  left: 1em;
  top: 1em;
}
#ui&gt;div {
  font-size: 20pt;
  padding: 1em;
  display: inline-block;
}
#ui&gt;div.selected {
  color: red;
}
</pre>
<p>Then we can go over each file and generate a set of merged boxes per
set of data and an element which when hovered over will show that set
and hide all others.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// show the selected data, hide the rest
function showFileInfo(fileInfos, fileInfo) {
  fileInfos.forEach((info) =&gt; {
    const visible = fileInfo === info;
    info.root.visible = visible;
    info.elem.className = visible ? 'selected' : '';
  });
  requestRenderIfNotRequested();
}

const uiElem = document.querySelector('#ui');
fileInfos.forEach((info) =&gt; {
  const boxes = addBoxes(info.file, info.hueRange);
  info.root = boxes;
  const div = document.createElement('div');
  info.elem = div;
  div.textContent = info.name;
  uiElem.appendChild(div);
  div.addEventListener('mouseover', () =&gt; {
    showFileInfo(fileInfos, info);
  });
});
// show the first set of data
showFileInfo(fileInfos, fileInfos[0]);
</pre>
<p>The one more change we need from the previous example is we need to make
<code class="notranslate" translate="no">addBoxes</code> take a <code class="notranslate" translate="no">hueRange</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-function addBoxes(file) {
+function addBoxes(file, hueRange) {

  ...

    // compute a color
-    const hue = THREE.MathUtils.lerp(0.7, 0.3, amount);
+    const hue = THREE.MathUtils.lerp(...hueRange, amount);

  ...
</pre>
<p>and with that we should be able to show 4 sets of data. Hover the mouse over the labels
or touch them to switch sets</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/lots-of-objects-multiple-data-sets.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/lots-of-objects-multiple-data-sets.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Note, there are a few strange data points that really stick out. I wonder what's up
with those!??! In any case how do we animate between these 4 sets of data.</p>
<p>Lots of ideas.</p>
<ul>
<li><p>Just fade between them using <a href="/docs/#api/en/materials/Material.opacity"><code class="notranslate" translate="no">Material.opacity</code></a></p>
<p>The problem with this solution is the cubes perfectly overlap which
means there will be z-fighting issues. It's possible we could fix
that by changing the depth function and using blending. We should
probably look into it.</p>
</li>
<li><p>Scale up the set we want to see and scale down the other sets</p>
<p>Because all the boxes have their origin at the center of the planet
if we scale them below 1.0 they will sink into the planet. At first that
sounds like a good idea but the issue is all the low height boxes
will disappear almost immediately and not be replaced until the new
data set scales up to 1.0. This makes the transition not very pleasant.
We could maybe fix that with a fancy custom shader.</p>
</li>
<li><p>Use Morphtargets</p>
<p>Morphtargets are a way were we supply multiple values for each vertex
in the geometry and <em>morph</em> or lerp (linear interpolate) between them.
Morphtargets are most commonly used for facial animation of 3D characters
but that's not their only use.</p>
</li>
</ul>
<p>Let's try morphtargets.</p>
<p>We'll still make a geometry for each set of data but we'll then extract
the <code class="notranslate" translate="no">position</code> attribute from each one and use them as morphtargets.</p>
<p>First let's change <code class="notranslate" translate="no">addBoxes</code> to just make and return the merged geometry.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-function addBoxes(file, hueRange) {
+function makeBoxes(file, hueRange) {
  const {min, max, data} = file;
  const range = max - min;

  ...

-  const mergedGeometry = BufferGeometryUtils.mergeGeometries(
-      geometries, false);
-  const material = new THREE.MeshBasicMaterial({
-    vertexColors: true,
-  });
-  const mesh = new THREE.Mesh(mergedGeometry, material);
-  scene.add(mesh);
-  return mesh;
+  return BufferGeometryUtils.mergeGeometries(
+     geometries, false);
}
</pre>
<p>There's one more thing we need to do here though. Morphtargets are required to
all have exactly the same number of vertices. Vertex #123 in one target needs
have a corresponding Vertex #123 in all other targets. But, as it is now
different data sets might have some data points with no data so no box will be
generated for that point which would mean no corresponding vertices for another
set. So, we need to check across all data sets and either always generate
something if there is data in any set or, generate nothing if there is data
missing in any set. Let's do the latter.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+function dataMissingInAnySet(fileInfos, latNdx, lonNdx) {
+  for (const fileInfo of fileInfos) {
+    if (fileInfo.file.data[latNdx][lonNdx] === undefined) {
+      return true;
+    }
+  }
+  return false;
+}

-function makeBoxes(file, hueRange) {
+function makeBoxes(file, hueRange, fileInfos) {
  const {min, max, data} = file;
  const range = max - min;

  ...

  const geometries = [];
  data.forEach((row, latNdx) =&gt; {
    row.forEach((value, lonNdx) =&gt; {
+      if (dataMissingInAnySet(fileInfos, latNdx, lonNdx)) {
+        return;
+      }
      const amount = (value - min) / range;

  ...
</pre>
<p>Now we'll change the code that was calling <code class="notranslate" translate="no">addBoxes</code> to use <code class="notranslate" translate="no">makeBoxes</code>
and setup morphtargets</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+// make geometry for each data set
+const geometries = fileInfos.map((info) =&gt; {
+  return makeBoxes(info.file, info.hueRange, fileInfos);
+});
+
+// use the first geometry as the base
+// and add all the geometries as morphtargets
+const baseGeometry = geometries[0];
+baseGeometry.morphAttributes.position = geometries.map((geometry, ndx) =&gt; {
+  const attribute = geometry.getAttribute('position');
+  const name = `target${ndx}`;
+  attribute.name = name;
+  return attribute;
+});
+baseGeometry.morphAttributes.color = geometries.map((geometry, ndx) =&gt; {
+  const attribute = geometry.getAttribute('color');
+  const name = `target${ndx}`;
+  attribute.name = name;
+  return attribute;
+});
+const material = new THREE.MeshBasicMaterial({
+  vertexColors: true,
+});
+const mesh = new THREE.Mesh(baseGeometry, material);
+scene.add(mesh);

const uiElem = document.querySelector('#ui');
fileInfos.forEach((info) =&gt; {
-  const boxes = addBoxes(info.file, info.hueRange);
-  info.root = boxes;
  const div = document.createElement('div');
  info.elem = div;
  div.textContent = info.name;
  uiElem.appendChild(div);
  function show() {
    showFileInfo(fileInfos, info);
  }
  div.addEventListener('mouseover', show);
  div.addEventListener('touchstart', show);
});
// show the first set of data
showFileInfo(fileInfos, fileInfos[0]);
</pre>
<p>Above we make geometry for each data set, use the first one as the base,
then get a <code class="notranslate" translate="no">position</code> attribute from each geometry and add it as
a morphtarget to the base geometry for <code class="notranslate" translate="no">position</code>.</p>
<p>Now we need to change how we're showing and hiding the various data sets.
Instead of showing or hiding a mesh we need to change the influence of the
morphtargets. For the data set we want to see we need to have an influence of 1
and for all the ones we don't want to see to we need to have an influence of 0.</p>
<p>We could just set them to 0 or 1 directly but if we did that we wouldn't see any
animation, it would just snap which would be no different than what we already
have. We could also write some custom animation code which would be easy but
because the original webgl globe uses
<a href="https://github.com/tweenjs/tween.js/">an animation library</a> let's use the same one here.</p>
<p>We need to include the library</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
+import TWEEN from 'three/addons/libs/tween.module.js';
</pre>
<p>And then create a <code class="notranslate" translate="no">Tween</code> to animate the influences.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// show the selected data, hide the rest
function showFileInfo(fileInfos, fileInfo) {
+  const targets = {};
-  fileInfos.forEach((info) =&gt; {
+  fileInfos.forEach((info, i) =&gt; {
    const visible = fileInfo === info;
-    info.root.visible = visible;
    info.elem.className = visible ? 'selected' : '';
+    targets[i] = visible ? 1 : 0;
  });
+  const durationInMs = 1000;
+  new TWEEN.Tween(mesh.morphTargetInfluences)
+    .to(targets, durationInMs)
+    .start();
  requestRenderIfNotRequested();
}
</pre>
<p>We're also suppose to call <code class="notranslate" translate="no">TWEEN.update</code> every frame inside our render loop
but that points out a problem. "tween.js" is designed for continuous rendering
but we are <a href="rendering-on-demand.html">rendering on demand</a>. We could
switch to continuous rendering but it's sometimes nice to only render on demand
as it well stop using the user's power when nothing is happening
so let's see if we can make it animate on demand.</p>
<p>We'll make a <code class="notranslate" translate="no">TweenManager</code> to help. We'll use it to create the <code class="notranslate" translate="no">Tween</code>s and
track them. It will have an <code class="notranslate" translate="no">update</code> method that will return <code class="notranslate" translate="no">true</code>
if we need to call it again and <code class="notranslate" translate="no">false</code> if all the animations are finished.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class TweenManger {
  constructor() {
    this.numTweensRunning = 0;
  }
  _handleComplete() {
    --this.numTweensRunning;
    console.assert(this.numTweensRunning &gt;= 0);
  }
  createTween(targetObject) {
    const self = this;
    ++this.numTweensRunning;
    let userCompleteFn = () =&gt; {};
    // create a new tween and install our own onComplete callback
    const tween = new TWEEN.Tween(targetObject).onComplete(function(...args) {
      self._handleComplete();
      userCompleteFn.call(this, ...args);
    });
    // replace the tween's onComplete function with our own
    // so we can call the user's callback if they supply one.
    tween.onComplete = (fn) =&gt; {
      userCompleteFn = fn;
      return tween;
    };
    return tween;
  }
  update() {
    TWEEN.update();
    return this.numTweensRunning &gt; 0;
  }
}
</pre>
<p>To use it we'll create one </p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
+  const tweenManager = new TweenManger();

  ...
</pre>
<p>We'll use it to create our <code class="notranslate" translate="no">Tween</code>s.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// show the selected data, hide the rest
function showFileInfo(fileInfos, fileInfo) {
  const targets = {};
  fileInfos.forEach((info, i) =&gt; {
    const visible = fileInfo === info;
    info.elem.className = visible ? 'selected' : '';
    targets[i] = visible ? 1 : 0;
  });
  const durationInMs = 1000;
-  new TWEEN.Tween(mesh.morphTargetInfluences)
+  tweenManager.createTween(mesh.morphTargetInfluences)
    .to(targets, durationInMs)
    .start();
  requestRenderIfNotRequested();
}
</pre>
<p>Then we'll update our render loop to update the tweens and keep rendering
if there are still animations running.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render() {
  renderRequested = false;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

+  if (tweenManager.update()) {
+    requestRenderIfNotRequested();
+  }

  controls.update();
  renderer.render(scene, camera);
}
render();
</pre>
<p>And with that we should be animating between data sets.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/lots-of-objects-morphtargets.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/lots-of-objects-morphtargets.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>I hope going through this was helpful. Using morphtargets is a common technique to
move lots of objects. As an example we could give every cube a random place in
another target and morph from that to their first positions on the globe. That
might be a cool way to introduce the globe.</p>
<p>Next you might be interested in adding labels to a globe which is covered
in <a href="align-html-elements-to-3d.html">Aligning HTML Elements to 3D</a>.</p>
<p>Note: We could try to just graph percent of men or percent of women or the raw
difference but based on how we are displaying the info, cubes that grow from the
surface of the earth, we'd prefer most cubes to be low. If we used one of these
other comparisons most cubes would be about 1/2 their maximum height which would
not make a good visualization. Feel free to change the <code class="notranslate" translate="no">amountGreaterThan</code> from
<a href="/docs/#api/en/math/Math.max(a - b, 0)"><code class="notranslate" translate="no">Math.max(a - b, 0)</code></a> to something like <code class="notranslate" translate="no">(a - b)</code> "raw difference" or <code class="notranslate" translate="no">a / (a +
b)</code> "percent" and you'll see what I mean.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# optimize-lots-of-objects.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Optimize Lots of Objects</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Optimize Lots of Objects">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Optimize Lots of Objects</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This article is part of a series of articles about three.js. The first article
is <a href="fundamentals.html">three.js fundamentals</a>. If you haven't read that
yet and you're new to three.js you might want to consider starting there. </p>
<p>There are many ways to optimize things for three.js. One way is often referred
to as <em>merging geometry</em>. Every <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> you create and three.js represents 1 or
more requests by the system to draw something. Drawing 2 things has more
overhead than drawing 1 even if the results are the same so one way to optimize
is to merge meshes.</p>
<p>Let's show an example of when this is a good solution for an issue. Let's
re-create the <a href="https://globe.chromeexperiments.com/">WebGL Globe</a>.</p>
<p>The first thing we need to do is get some data. The WebGL Globe said the data
they use comes from <a href="http://sedac.ciesin.columbia.edu/gpw/">SEDAC</a>. Checking out
the site I saw there was <a href="https://beta.sedac.ciesin.columbia.edu/data/set/gpw-v4-basic-demographic-characteristics-rev10">demographic data in a grid
format</a>.
I downloaded the data at 60 minute resolution. Then I took a look at the data</p>
<p>It looks like this</p>
<pre class="prettyprint showlinemods notranslate lang-txt" translate="no"> ncols         360
 nrows         145
 xllcorner     -180
 yllcorner     -60
 cellsize      0.99999999999994
 NODATA_value  -9999
 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 ...
 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 ...
 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 ...
 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 ...
 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 ...
 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 ...
 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 ...
 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 ...
 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 ...
 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 ...
 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 ...
 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 ...
 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 ...
 9.241768 8.790958 2.095345 -9999 0.05114867 -9999 -9999 -9999 -9999 -999...
 1.287993 0.4395509 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999...
 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 -9999 ...
</pre>
<p>There's a few lines that are like key/value pairs followed by lines with a value
per grid point, one line for each row of data points.</p>
<p>To make sure we understand the data let's try to plot it in 2D.</p>
<p>First some code to load the text file</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">async function loadFile(url) {
  const res = await fetch(url);
  return res.text();
}
</pre>
<p>The code above returns a <code class="notranslate" translate="no">Promise</code> with the contents of the file at <code class="notranslate" translate="no">url</code>;</p>
<p>Then we need some code to parse the file</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function parseData(text) {
  const data = [];
  const settings = {data};
  let max;
  let min;
  // split into lines
  text.split('\n').forEach((line) =&gt; {
    // split the line by whitespace
    const parts = line.trim().split(/\s+/);
    if (parts.length === 2) {
      // only 2 parts, must be a key/value pair
      settings[parts[0]] = parseFloat(parts[1]);
    } else if (parts.length &gt; 2) {
      // more than 2 parts, must be data
      const values = parts.map((v) =&gt; {
        const value = parseFloat(v);
        if (value === settings.NODATA_value) {
          return undefined;
        }
        max = Math.max(max === undefined ? value : max, value);
        min = Math.min(min === undefined ? value : min, value);
        return value;
      });
      data.push(values);
    }
  });
  return Object.assign(settings, {min, max});
}
</pre>
<p>The code above returns an object with all the key/value pairs from the file as
well as a <code class="notranslate" translate="no">data</code> property with all the data in one large array and the <code class="notranslate" translate="no">min</code> and
<code class="notranslate" translate="no">max</code> values found in the data.</p>
<p>Then we need some code to draw that data</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function drawData(file) {
  const {min, max, data} = file;
  const range = max - min;
  const ctx = document.querySelector('canvas').getContext('2d');
  // make the canvas the same size as the data
  ctx.canvas.width = ncols;
  ctx.canvas.height = nrows;
  // but display it double size so it's not too small
  ctx.canvas.style.width = px(ncols * 2);
  ctx.canvas.style.height = px(nrows * 2);
  // fill the canvas to dark gray
  ctx.fillStyle = '#444';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // draw each data point
  data.forEach((row, latNdx) =&gt; {
    row.forEach((value, lonNdx) =&gt; {
      if (value === undefined) {
        return;
      }
      const amount = (value - min) / range;
      const hue = 1;
      const saturation = 1;
      const lightness = amount;
      ctx.fillStyle = hsl(hue, saturation, lightness);
      ctx.fillRect(lonNdx, latNdx, 1, 1);
    });
  });
}

function px(v) {
  return `${v | 0}px`;
}

function hsl(h, s, l) {
  return `hsl(${h * 360 | 0},${s * 100 | 0}%,${l * 100 | 0}%)`;
}
</pre>
<p>And finally gluing it all together</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">loadFile('resources/data/gpw/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc')
  .then(parseData)
  .then(drawData);
</pre>
<p>Gives us this result</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/gpw-data-viewer.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/gpw-data-viewer.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>So that seems to work. </p>
<p>Let's try it in 3D. Starting with the code from <a href="rendering-on-demand.html">rendering on
demand</a> We'll make one box per data in the
file.</p>
<p>First let's make a simple sphere with a texture of the world. Here's the texture</p>
<div class="threejs_center"><img src="../examples/resources/images/world.jpg" style="width: 600px"></div>

<p>And the code to set it up.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const loader = new THREE.TextureLoader();
  const texture = loader.load('resources/images/world.jpg', render);
  const geometry = new THREE.SphereGeometry(1, 64, 32);
  const material = new THREE.MeshBasicMaterial({map: texture});
  scene.add(new THREE.Mesh(geometry, material));
}
</pre>
<p>Notice the call to <code class="notranslate" translate="no">render</code> when the texture has finished loading. We need this
because we're <a href="rendering-on-demand.html">rendering on demand</a> instead of
continuously so we need to render once when the texture is loaded.</p>
<p>Then we need to change the code that drew a dot per data point above to instead
make a box per data point.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function addBoxes(file) {
  const {min, max, data} = file;
  const range = max - min;

  // make one box geometry
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  // make it so it scales away from the positive Z axis
  geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5));

  // these helpers will make it easy to position the boxes
  // We can rotate the lon helper on its Y axis to the longitude
  const lonHelper = new THREE.Object3D();
  scene.add(lonHelper);
  // We rotate the latHelper on its X axis to the latitude
  const latHelper = new THREE.Object3D();
  lonHelper.add(latHelper);
  // The position helper moves the object to the edge of the sphere
  const positionHelper = new THREE.Object3D();
  positionHelper.position.z = 1;
  latHelper.add(positionHelper);

  const lonFudge = Math.PI * .5;
  const latFudge = Math.PI * -0.135;
  data.forEach((row, latNdx) =&gt; {
    row.forEach((value, lonNdx) =&gt; {
      if (value === undefined) {
        return;
      }
      const amount = (value - min) / range;
      const material = new THREE.MeshBasicMaterial();
      const hue = THREE.MathUtils.lerp(0.7, 0.3, amount);
      const saturation = 1;
      const lightness = THREE.MathUtils.lerp(0.1, 1.0, amount);
      material.color.setHSL(hue, saturation, lightness);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // adjust the helpers to point to the latitude and longitude
      lonHelper.rotation.y = THREE.MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge;
      latHelper.rotation.x = THREE.MathUtils.degToRad(latNdx + file.yllcorner) + latFudge;

      // use the world matrix of the position helper to
      // position this mesh.
      positionHelper.updateWorldMatrix(true, false);
      mesh.applyMatrix4(positionHelper.matrixWorld);

      mesh.scale.set(0.005, 0.005, THREE.MathUtils.lerp(0.01, 0.5, amount));
    });
  });
}
</pre>
<p>The code is mostly straight forward from our test drawing code. </p>
<p>We make one box and adjust its center so it scales away from positive Z. If we
didn't do this it would scale from the center but we want them to grow away from the origin.</p>
<div class="spread">
  <div>
    <div data-diagram="scaleCenter" style="height: 250px"></div>
    <div class="code">default</div>
  </div>
  <div>
    <div data-diagram="scalePositiveZ" style="height: 250px"></div>
    <div class="code">adjusted</div>
  </div>
</div>

<p>Of course we could also solve that by parenting the box to more <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">THREE.Object3D</code></a>
objects like we covered in <a href="scenegraph.html">scene graphs</a> but the more
nodes we add to a scene graph the slower it gets.</p>
<p>We also setup this small hierarchy of nodes of <code class="notranslate" translate="no">lonHelper</code>, <code class="notranslate" translate="no">latHelper</code>, and
<code class="notranslate" translate="no">positionHelper</code>. We use these objects to compute a position around the sphere
were to place the box. </p>
<div class="spread">
  <div data-diagram="lonLatPos" style="width: 600px; height: 400px;"></div>
</div>

<p>Above the <span style="color: green;">green bar</span> represents <code class="notranslate" translate="no">lonHelper</code> and
is used to rotate toward longitude on the equator. The <span style="color: blue;">
blue bar</span> represents <code class="notranslate" translate="no">latHelper</code> which is used to rotate to a
latitude above or below the equator. The <span style="color: red;">red
sphere</span> represents the offset that that <code class="notranslate" translate="no">positionHelper</code> provides.</p>
<p>We could do all of the math manually to figure out positions on the globe but
doing it this way leaves most of the math to the library itself so we don't need
to deal with.</p>
<p>For each data point we create a <a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a> and a <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> and then we ask
for the world matrix of the <code class="notranslate" translate="no">positionHelper</code> and apply that to the new <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a>.
Finally we scale the mesh at its new position.</p>
<p>Like above, we could also have created a <code class="notranslate" translate="no">latHelper</code>, <code class="notranslate" translate="no">lonHelper</code>, and
<code class="notranslate" translate="no">positionHelper</code> for every new box but that would be even slower.</p>
<p>There are up to 360x145 boxes we're going to create. That's up to 52000 boxes.
Because some data points are marked as "NO_DATA" the actual number of boxes
we're going to create is around 19000. If we added 3 extra helper objects per
box that would be nearly 80000 scene graph nodes that THREE.js would have to
compute positions for. By instead using one set of helpers to just position the
meshes we save around 60000 operations.</p>
<p>A note about <code class="notranslate" translate="no">lonFudge</code> and <code class="notranslate" translate="no">latFudge</code>. <code class="notranslate" translate="no">lonFudge</code> is π/2 which is a quarter of a turn.
That makes sense. It just means the texture or texture coordinates start at a
different offset around the globe. <code class="notranslate" translate="no">latFudge</code> on the other hand I have no idea
why it needs to be π * -0.135, that's just an amount that made the boxes line up
with the texture.</p>
<p>The last thing we need to do is call our loader</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">loadFile('resources/data/gpw/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc')
  .then(parseData)
-  .then(drawData)
+  .then(addBoxes)
+  .then(render);
</pre><p>Once the data has finished loading and parsing then we need to render at least
once since we're <a href="rendering-on-demand.html">rendering on demand</a>.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/lots-of-objects-slow.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/lots-of-objects-slow.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>If you try to rotate the example above by dragging on the sample you'll likely
notice it's slow.</p>
<p>We can check the framerate by <a href="debugging-javascript.html">opening the
devtools</a> and turning on the browser's frame
rate meter.</p>
<div class="threejs_center"><img src="../resources/images/bring-up-fps-meter.gif"></div>

<p>On my machine I see a framerate under 20fps.</p>
<div class="threejs_center"><img src="../resources/images/fps-meter.gif"></div>

<p>That doesn't feel very good to me and I suspect many people have slower machines
which would make it even worse. We'd better look into optimizing.</p>
<p>For this particular problem we can merge all the boxes into a single geometry.
We're currently drawing around 19000 boxes. By merging them into a single
geometry we'd remove 18999 operations.</p>
<p>Here's the new code to merge the boxes into a single geometry.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function addBoxes(file) {
  const {min, max, data} = file;
  const range = max - min;

-  // make one box geometry
-  const boxWidth = 1;
-  const boxHeight = 1;
-  const boxDepth = 1;
-  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
-  // make it so it scales away from the positive Z axis
-  geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5));

  // these helpers will make it easy to position the boxes
  // We can rotate the lon helper on its Y axis to the longitude
  const lonHelper = new THREE.Object3D();
  scene.add(lonHelper);
  // We rotate the latHelper on its X axis to the latitude
  const latHelper = new THREE.Object3D();
  lonHelper.add(latHelper);
  // The position helper moves the object to the edge of the sphere
  const positionHelper = new THREE.Object3D();
  positionHelper.position.z = 1;
  latHelper.add(positionHelper);
+  // Used to move the center of the box so it scales from the position Z axis
+  const originHelper = new THREE.Object3D();
+  originHelper.position.z = 0.5;
+  positionHelper.add(originHelper);

  const lonFudge = Math.PI * .5;
  const latFudge = Math.PI * -0.135;
+  const geometries = [];
  data.forEach((row, latNdx) =&gt; {
    row.forEach((value, lonNdx) =&gt; {
      if (value === undefined) {
        return;
      }
      const amount = (value - min) / range;

-      const material = new THREE.MeshBasicMaterial();
-      const hue = THREE.MathUtils.lerp(0.7, 0.3, amount);
-      const saturation = 1;
-      const lightness = THREE.MathUtils.lerp(0.1, 1.0, amount);
-      material.color.setHSL(hue, saturation, lightness);
-      const mesh = new THREE.Mesh(geometry, material);
-      scene.add(mesh);

+      const boxWidth = 1;
+      const boxHeight = 1;
+      const boxDepth = 1;
+      const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

      // adjust the helpers to point to the latitude and longitude
      lonHelper.rotation.y = THREE.MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge;
      latHelper.rotation.x = THREE.MathUtils.degToRad(latNdx + file.yllcorner) + latFudge;

-      // use the world matrix of the position helper to
-      // position this mesh.
-      positionHelper.updateWorldMatrix(true, false);
-      mesh.applyMatrix4(positionHelper.matrixWorld);
-
-      mesh.scale.set(0.005, 0.005, THREE.MathUtils.lerp(0.01, 0.5, amount));

+      // use the world matrix of the origin helper to
+      // position this geometry
+      positionHelper.scale.set(0.005, 0.005, THREE.MathUtils.lerp(0.01, 0.5, amount));
+      originHelper.updateWorldMatrix(true, false);
+      geometry.applyMatrix4(originHelper.matrixWorld);
+
+      geometries.push(geometry);
    });
  });

+  const mergedGeometry = BufferGeometryUtils.mergeGeometries(
+      geometries, false);
+  const material = new THREE.MeshBasicMaterial({color:'red'});
+  const mesh = new THREE.Mesh(mergedGeometry, material);
+  scene.add(mesh);

}
</pre>
<p>Above we removed the code that was changing the box geometry's center point and
are instead doing it by adding an <code class="notranslate" translate="no">originHelper</code>. Before we were using the same
geometry 19000 times. This time we are creating new geometry for every single
box and since we are going to use <code class="notranslate" translate="no">applyMatrix</code> to move the vertices of each box
geometry we might as well do it once instead of twice.</p>
<p>At the end we pass an array of all the geometries to
<code class="notranslate" translate="no">BufferGeometryUtils.mergeGeometries</code> which will combined all of
them into a single mesh.</p>
<p>We also need to include the <code class="notranslate" translate="no">BufferGeometryUtils</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
</pre>
<p>And now, at least on my machine, I get 60 frames per second</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/lots-of-objects-merged.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/lots-of-objects-merged.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>So that worked but because it's one mesh we only get one material which means we
only get one color where as before we had a different color on each box. We can
fix that by using vertex colors.</p>
<p>Vertex colors add a color per vertex. By setting all the colors of each vertex
of each box to specific colors every box will have a different color.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const color = new THREE.Color();

const lonFudge = Math.PI * .5;
const latFudge = Math.PI * -0.135;
const geometries = [];
data.forEach((row, latNdx) =&gt; {
  row.forEach((value, lonNdx) =&gt; {
    if (value === undefined) {
      return;
    }
    const amount = (value - min) / range;

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    // adjust the helpers to point to the latitude and longitude
    lonHelper.rotation.y = THREE.MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge;
    latHelper.rotation.x = THREE.MathUtils.degToRad(latNdx + file.yllcorner) + latFudge;

    // use the world matrix of the origin helper to
    // position this geometry
    positionHelper.scale.set(0.005, 0.005, THREE.MathUtils.lerp(0.01, 0.5, amount));
    originHelper.updateWorldMatrix(true, false);
    geometry.applyMatrix4(originHelper.matrixWorld);

+    // compute a color
+    const hue = THREE.MathUtils.lerp(0.7, 0.3, amount);
+    const saturation = 1;
+    const lightness = THREE.MathUtils.lerp(0.4, 1.0, amount);
+    color.setHSL(hue, saturation, lightness);
+    // get the colors as an array of values from 0 to 255
+    const rgb = color.toArray().map(v =&gt; v * 255);
+
+    // make an array to store colors for each vertex
+    const numVerts = geometry.getAttribute('position').count;
+    const itemSize = 3;  // r, g, b
+    const colors = new Uint8Array(itemSize * numVerts);
+
+    // copy the color into the colors array for each vertex
+    colors.forEach((v, ndx) =&gt; {
+      colors[ndx] = rgb[ndx % 3];
+    });
+
+    const normalized = true;
+    const colorAttrib = new THREE.BufferAttribute(colors, itemSize, normalized);
+    geometry.setAttribute('color', colorAttrib);

    geometries.push(geometry);
  });
});
</pre>
<p>The code above looks up the number or vertices needed by getting the <code class="notranslate" translate="no">position</code>
attribute from the geometry. We then create a <code class="notranslate" translate="no">Uint8Array</code> to put the colors in.
It then adds that as an attribute by calling <code class="notranslate" translate="no">geometry.setAttribute</code>.</p>
<p>Lastly we need to tell three.js to use the vertex colors. </p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const mergedGeometry = BufferGeometryUtils.mergeGeometries(
    geometries, false);
-const material = new THREE.MeshBasicMaterial({color:'red'});
+const material = new THREE.MeshBasicMaterial({
+  vertexColors: true,
+});
const mesh = new THREE.Mesh(mergedGeometry, material);
scene.add(mesh);
</pre>
<p>And with that we get our colors back</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/lots-of-objects-merged-vertexcolors.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/lots-of-objects-merged-vertexcolors.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Merging geometry is a common optimization technique. For example rather than
100 trees you might merge the trees into 1 geometry, a pile of individual rocks
into a single geometry of rocks, a picket fence from individual pickets into
one fence mesh. Another example in Minecraft it doesn't likely draw each cube
individually but rather creates groups of merged cubes and also selectively removing
faces that are never visible.</p>
<p>The problem with making everything one mesh though is it's no longer easy
to move any part that was previously separate. Depending on our use case
though there are creative solutions. We'll explore one in
<a href="optimize-lots-of-objects-animated.html">another article</a>.</p>
<p><canvas id="c"></canvas></p>
<script type="module" src="../resources/threejs-lots-of-objects.js"></script>
        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# picking.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Picking</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Picking">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Picking</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p><em>Picking</em> refers to the process of figuring out which object a user clicked on or touched. There are tons of ways to implement picking each with their tradeoffs. Let's go over the 2 most common.</p>
<p>Probably the most common way of <em>picking</em> is by doing raycasting which means to <em>cast</em> a ray from the mouse through the frustum of the scene and computing which objects that ray intersects. Conceptually it's very simple.</p>
<p>First we'd take the position of the mouse. We'd convert that into world space by applying the camera's projection and orientation. We'd compute a ray from the near plane of the camera's frustum to the far plane. Then, for every triangle of every object in the scene we'd check if that ray intersects that triangle. If your scene has 1000 objects and each object has 1000 triangles then 1 million triangles will need to be checked.</p>
<p>A few optimizations would include first checking if the ray intersects with an object's bounding sphere or bounding box, the sphere or box that contains the entire object. If the ray doesn't intersect one of those then we don't have to check the triangles of that object.</p>
<p>THREE.js provides a <code class="notranslate" translate="no">RayCaster</code> class that does exactly this.</p>
<p>Let's make a scene with a 100 objects and try picking them. We'll
start with an example from <a href="responsive.html">the article on responsive pages</a></p>
<p>A few changes</p>
<p>We'll parent the camera to another object so we can spin that other object and the camera will move around the scene just like a selfie stick.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">*const fov = 60;
const aspect = 2;  // the canvas default
const near = 0.1;
*const far = 200;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
*camera.position.z = 30;

const scene = new THREE.Scene();
+scene.background = new THREE.Color('white');

+// put the camera on a pole (parent it to an object)
+// so we can spin the pole to move the camera around the scene
+const cameraPole = new THREE.Object3D();
+scene.add(cameraPole);
+cameraPole.add(camera);
</pre>
<p>and in the <code class="notranslate" translate="no">render</code> function we'll spin the camera pole.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">cameraPole.rotation.y = time * .1;
</pre>
<p>Also let's put the light on the camera so the light moves with it.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-scene.add(light);
+camera.add(light);
</pre>
<p>Let's generate 100 cubes with random colors in random positions, orientations,
and scales.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

function rand(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return min + (max - min) * Math.random();
}

function randomColor() {
  return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
}

const numObjects = 100;
for (let i = 0; i &lt; numObjects; ++i) {
  const material = new THREE.MeshPhongMaterial({
    color: randomColor(),
  });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
  cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
  cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));
}
</pre>
<p>And finally let's pick.</p>
<p>Let's make a simple class to manage the picking</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(normalizedPosition, scene, camera, time) {
    // restore the color if there is a picked object
    if (this.pickedObject) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }

    // cast a ray through the frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      this.pickedObject = intersectedObjects[0].object;
      // save its color
      this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
      // set its emissive color to flashing red/yellow
      this.pickedObject.material.emissive.setHex((time * 8) % 2 &gt; 1 ? 0xFFFF00 : 0xFF0000);
    }
  }
}
</pre>
<p>You can see we create a <code class="notranslate" translate="no">RayCaster</code> and then we can call the <code class="notranslate" translate="no">pick</code> function to cast a ray through the scene. If the ray hits something we change the color of the first thing it hits.</p>
<p>Of course we could call this function only when the user pressed the mouse <em>down</em> which is probably usually what you want but for this example we'll pick every frame whatever is under the mouse. To do this we first need to track where the mouse
is</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const pickPosition = {x: 0, y: 0};
clearPickPosition();

...

function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
  };
}

function setPickPosition(event) {
  const pos = getCanvasRelativePosition(event);
  pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
  pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
}

function clearPickPosition() {
  // unlike the mouse which always has a position
  // if the user stops touching the screen we want
  // to stop picking. For now we just pick a value
  // unlikely to pick something
  pickPosition.x = -100000;
  pickPosition.y = -100000;
}

window.addEventListener('mousemove', setPickPosition);
window.addEventListener('mouseout', clearPickPosition);
window.addEventListener('mouseleave', clearPickPosition);
</pre>
<p>Notice we're recording a normalized mouse position. Regardless of the size of the canvas we need a value that goes from -1 on the left to +1 on the right. Similarly we need a value that goes from -1 on the bottom to +1 on the top.</p>
<p>While we're at it lets support mobile as well</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">window.addEventListener('touchstart', (event) =&gt; {
  // prevent the window from scrolling
  event.preventDefault();
  setPickPosition(event.touches[0]);
}, {passive: false});

window.addEventListener('touchmove', (event) =&gt; {
  setPickPosition(event.touches[0]);
});

window.addEventListener('touchend', clearPickPosition);
</pre>
<p>And finally in our <code class="notranslate" translate="no">render</code> function we call the <code class="notranslate" translate="no">PickHelper</code>'s <code class="notranslate" translate="no">pick</code> function.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const pickHelper = new PickHelper();

function render(time) {
  time *= 0.001;  // convert to seconds;

  ...

+  pickHelper.pick(pickPosition, scene, camera, time);

  renderer.render(scene, camera);

  ...
</pre>
<p>and here's the result</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/picking-raycaster.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/picking-raycaster.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>This appears to work great and it probably does for many use cases
but there are several issues.</p>
<ol>
<li><p>It's CPU based.</p>
<p>JavaScript is going through each object and checking if the ray intersects
that object's bounding box or bounding sphere. If it does then JavaScript
has to go through each and every triangle in that object and check if the
ray intersects the triangle.</p>
<p>The good part of this is JavaScript can easily compute exactly where the
ray intersected the triangle and provide us with that data. For example
if you wanted to put a marker where the intersection happened.</p>
<p>The bad part is that's a lot of work for the CPU to do. If you have
objects with lots of triangles it might be slow.</p>
</li>
<li><p>It doesn't handle any strange shaders or displacements.</p>
<p>If you have a shader that deforms or morphs the geometry JavaScript
has no knowledge of that deformation and so will give the wrong answer.
For example AFAIK you can't use this method with skinned objects.</p>
</li>
<li><p>It doesn't handle transparent holes.</p>
</li>
</ol>
<p>As an example let's apply this texture to the cubes.</p>
<div class="threejs_center"><img class="checkerboard" src="../examples/resources/images/frame.png"></div>

<p>We'll just make these changes</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const loader = new THREE.TextureLoader();
+const texture = loader.load('resources/images/frame.png');

const numObjects = 100;
for (let i = 0; i &lt; numObjects; ++i) {
  const material = new THREE.MeshPhongMaterial({
    color: randomColor(),
    +map: texture,
    +transparent: true,
    +side: THREE.DoubleSide,
    +alphaTest: 0.1,
  });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  ...
</pre>
<p>And running that you should quickly see the issue</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/picking-raycaster-transparency.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/picking-raycaster-transparency.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Try to pick something through a box and you can't</p>
<div class="threejs_center"><img src="../resources/images/picking-transparent-issue.jpg" style="width: 635px;"></div>

<p>This is because JavaScript can't easily look into the textures and materials and figure out if part of your object is really transparent or not.</p>
<p>A solution all of these issues is to use GPU based picking. Unfortunately while it is conceptually simple it is more complicated to use than the ray casting method above.</p>
<p>To do GPU picking we render each object in a unique color offscreen. We then look up the color of the pixel corresponding to the mouse position. The color tells us which object was picked.</p>
<p>This can solve issue 2 and 3 above. As for issue 1, speed, it really depends. Every object has to be drawn twice. Once to draw it for viewing and again to draw it for picking. It's possible with fancier solutions maybe both of those could be done at the same time but we're not going to try that.</p>
<p>One thing we can do though is since we're only going to be reading one pixel we can just setup the camera so only that one pixel is drawn. We can do this using <a href="/docs/#api/en/cameras/PerspectiveCamera.setViewOffset"><code class="notranslate" translate="no">PerspectiveCamera.setViewOffset</code></a> which lets us tell THREE.js to compute a camera that just renders a smaller part of a larger rectangle. This should save some time.</p>
<p>To do this type of picking in THREE.js at the moment requires we create 2 scenes. One we will fill with our normal meshes. The other we'll fill with meshes that use our picking material.</p>
<p>So, first create a second scene and make sure it clears to black.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const scene = new THREE.Scene();
scene.background = new THREE.Color('white');
const pickingScene = new THREE.Scene();
pickingScene.background = new THREE.Color(0);
</pre>
<p>Then, for each cube we place in the main scene we make a corresponding "picking cube" at the same position as the original cube, put it in the <code class="notranslate" translate="no">pickingScene</code>, and set its material to something that will draw the object's id as its color. Also we keep a map of ids to objects so when we look up an id later we can map it back to its corresponding object.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const idToObject = {};
+const numObjects = 100;
for (let i = 0; i &lt; numObjects; ++i) {
+  const id = i + 1;
  const material = new THREE.MeshPhongMaterial({
    color: randomColor(),
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    alphaTest: 0.1,
  });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
+  idToObject[id] = cube;

  cube.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
  cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
  cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));

+  const pickingMaterial = new THREE.MeshPhongMaterial({
+    emissive: new THREE.Color().setHex(id, THREE.NoColorSpace),
+    color: new THREE.Color(0, 0, 0),
+    specular: new THREE.Color(0, 0, 0),
+    map: texture,
+    transparent: true,
+    side: THREE.DoubleSide,
+    alphaTest: 0.5,
+    blending: THREE.NoBlending,
+  });
+  const pickingCube = new THREE.Mesh(geometry, pickingMaterial);
+  pickingScene.add(pickingCube);
+  pickingCube.position.copy(cube.position);
+  pickingCube.rotation.copy(cube.rotation);
+  pickingCube.scale.copy(cube.scale);
}
</pre>
<p>Note that we are abusing the <a href="/docs/#api/en/materials/MeshPhongMaterial"><code class="notranslate" translate="no">MeshPhongMaterial</code></a> here. By setting its <code class="notranslate" translate="no">emissive</code> to our id and the <code class="notranslate" translate="no">color</code> and <code class="notranslate" translate="no">specular</code> to 0 that will end up rendering the id only where the texture's alpha is greater than <code class="notranslate" translate="no">alphaTest</code>. We also need to set <code class="notranslate" translate="no">blending</code> to <code class="notranslate" translate="no">NoBlending</code> so that the id is not multiplied by alpha.</p>
<p>Note that abusing the <a href="/docs/#api/en/materials/MeshPhongMaterial"><code class="notranslate" translate="no">MeshPhongMaterial</code></a> might not be the best solution as it will still calculate all our lights when drawing the picking scene even though we don't need those calculations. A more optimized solution would make a custom shader that just writes the id where the texture's alpha is greater than <code class="notranslate" translate="no">alphaTest</code>.</p>
<p>Because we're picking from pixels instead of ray casting we can change the code that sets the pick position to just use pixels.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function setPickPosition(event) {
  const pos = getCanvasRelativePosition(event);
-  pickPosition.x = (pos.x / canvas.clientWidth ) *  2 - 1;
-  pickPosition.y = (pos.y / canvas.clientHeight) * -2 + 1;  // note we flip Y
+  pickPosition.x = pos.x;
+  pickPosition.y = pos.y;
}
</pre>
<p>Then let's change the <code class="notranslate" translate="no">PickHelper</code> into a <code class="notranslate" translate="no">GPUPickHelper</code>. It will use a <a href="/docs/#api/en/renderers/WebGLRenderTarget"><code class="notranslate" translate="no">WebGLRenderTarget</code></a> like we covered the <a href="rendertargets.html">article on render targets</a>. Our render target here is only a single pixel in size, 1x1. </p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-class PickHelper {
+class GPUPickHelper {
  constructor() {
-    this.raycaster = new THREE.Raycaster();
+    // create a 1x1 pixel render target
+    this.pickingTexture = new THREE.WebGLRenderTarget(1, 1);
+    this.pixelBuffer = new Uint8Array(4);
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(cssPosition, scene, camera, time) {
+    const {pickingTexture, pixelBuffer} = this;

    // restore the color if there is a picked object
    if (this.pickedObject) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }

+    // set the view offset to represent just a single pixel under the mouse
+    const pixelRatio = renderer.getPixelRatio();
+    camera.setViewOffset(
+        renderer.getContext().drawingBufferWidth,   // full width
+        renderer.getContext().drawingBufferHeight,  // full top
+        cssPosition.x * pixelRatio | 0,             // rect x
+        cssPosition.y * pixelRatio | 0,             // rect y
+        1,                                          // rect width
+        1,                                          // rect height
+    );
+    // render the scene
+    renderer.setRenderTarget(pickingTexture)
+    renderer.render(scene, camera);
+    renderer.setRenderTarget(null);
+
+    // clear the view offset so rendering returns to normal
+    camera.clearViewOffset();
+    //read the pixel
+    renderer.readRenderTargetPixels(
+        pickingTexture,
+        0,   // x
+        0,   // y
+        1,   // width
+        1,   // height
+        pixelBuffer);
+
+    const id =
+        (pixelBuffer[0] &lt;&lt; 16) |
+        (pixelBuffer[1] &lt;&lt;  8) |
+        (pixelBuffer[2]      );

-    // cast a ray through the frustum
-    this.raycaster.setFromCamera(normalizedPosition, camera);
-    // get the list of objects the ray intersected
-    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
-    if (intersectedObjects.length) {
-      // pick the first object. It's the closest one
-      this.pickedObject = intersectedObjects[0].object;

+    const intersectedObject = idToObject[id];
+    if (intersectedObject) {
+      // pick the first object. It's the closest one
+      this.pickedObject = intersectedObject;
      // save its color
      this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
      // set its emissive color to flashing red/yellow
      this.pickedObject.material.emissive.setHex((time * 8) % 2 &gt; 1 ? 0xFFFF00 : 0xFF0000);
    }
  }
}
</pre>
<p>Then we just need to use it</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-const pickHelper = new PickHelper();
+const pickHelper = new GPUPickHelper();
</pre>
<p>and pass it the <code class="notranslate" translate="no">pickScene</code> instead of the <code class="notranslate" translate="no">scene</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-  pickHelper.pick(pickPosition, scene, camera, time);
+  pickHelper.pick(pickPosition, pickScene, camera, time);
</pre>
<p>And now it should let you pick through the transparent parts</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/picking-gpu.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/picking-gpu.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>I hope that gives some idea of how to implement picking. In a future article maybe we can cover how to manipulate objects with the mouse.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# post-processing.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Post Processing</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Post Processing">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Post Processing</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p><em>Post processing</em> generally refers to applying some kind of effect or filter to
a 2D image. In the case of THREE.js we have a scene with a bunch of meshes in
it. We render that scene into a 2D image. Normally that image is rendered
directly into the canvas and displayed in the browser but instead we can <a href="rendertargets.html">render
it to a render target</a> and then apply some <em>post
processing</em> effects to the result before drawing it to the canvas. It's called
post processing because it happens after (post) the main scene processing.</p>
<p>Examples of post processing are Instagram like filters,
Photoshop filters, etc...</p>
<p>THREE.js has some example classes to help setup a post processing pipeline. The
way it works is you create an <code class="notranslate" translate="no">EffectComposer</code> and to it you add multiple <code class="notranslate" translate="no">Pass</code>
objects. You then call <code class="notranslate" translate="no">EffectComposer.render</code> and it renders your scene to a
<a href="rendertargets.html">render target</a> and then applies each <code class="notranslate" translate="no">Pass</code>.</p>
<p>Each <code class="notranslate" translate="no">Pass</code> can be some post processing effect like adding a vignette, blurring,
applying a bloom, applying film grain, adjusting the hue, saturation, contrast,
etc... and finally rendering the result to the canvas.</p>
<p>It's a little bit important to understand how <code class="notranslate" translate="no">EffectComposer</code> functions. It
creates two <a href="rendertargets.html">render targets</a>. Let's call them
<strong>rtA</strong> and <strong>rtB</strong>.</p>
<p>Then, you call <code class="notranslate" translate="no">EffectComposer.addPass</code> to add each pass in the order you want
to apply them. The passes are then applied <em>something like</em> this.</p>
<div class="threejs_center"><img src="../resources/images/threejs-postprocessing.svg" style="width: 600px"></div>

<p>First the scene you passed into <code class="notranslate" translate="no">RenderPass</code> is rendered to <strong>rtA</strong>, then
<strong>rtA</strong> is passed to the next pass, whatever it is. That pass uses <strong>rtA</strong> as
input to do whatever it does and writes the results to <strong>rtB</strong>. <strong>rtB</strong> is then
passed to the next pass which uses <strong>rtB</strong> as input and writes back to <strong>rtA</strong>.
This continues through all the passes. </p>
<p>Each <code class="notranslate" translate="no">Pass</code> has 4 basic options</p>
<h2 id="-enabled-"><code class="notranslate" translate="no">enabled</code></h2>
<p>Whether or not to use this pass</p>
<h2 id="-needsswap-"><code class="notranslate" translate="no">needsSwap</code></h2>
<p>Whether or not to swap <code class="notranslate" translate="no">rtA</code> and <code class="notranslate" translate="no">rtB</code> after finishing this pass</p>
<h2 id="-clear-"><code class="notranslate" translate="no">clear</code></h2>
<p>Whether or not to clear before rendering this pass</p>
<h2 id="-rendertoscreen-"><code class="notranslate" translate="no">renderToScreen</code></h2>
<p>Whether or not to render to the canvas instead the current destination render
target. In most use cases you do not set this flag explicitly since the last pass in the pass chain is automatically rendered to screen.</p>
<p>Let's put together a basic example. We'll start with the example from <a href="responsive.html">the
article on responsiveness</a>.</p>
<p>To that first we create an <code class="notranslate" translate="no">EffectComposer</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const composer = new EffectComposer(renderer);
</pre>
<p>Then as the first pass we add a <code class="notranslate" translate="no">RenderPass</code> that will render our scene with our
camera into the first render target.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">composer.addPass(new RenderPass(scene, camera));
</pre>
<p>Next we add a <code class="notranslate" translate="no">BloomPass</code>. A <code class="notranslate" translate="no">BloomPass</code> renders its input to a generally
smaller render target and blurs the result. It then adds that blurred result on
top of the original input. This makes the scene <em>bloom</em></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const bloomPass = new BloomPass(
    1,    // strength
    25,   // kernel size
    4,    // sigma ?
    256,  // blur render target resolution
);
composer.addPass(bloomPass);
</pre>
<p>Next we had a <code class="notranslate" translate="no">FilmPass</code> that draws noise and scanlines on top of its input.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const filmPass = new FilmPass(
    0.5,   // intensity
    false,  // grayscale
);
composer.addPass(filmPass);
</pre>
<p>Finally we had a <code class="notranslate" translate="no">OutputPass</code> which performs color space conversion to sRGB and optional tone mapping.
This pass is usually the last pass of the pass chain.
</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const outputPass = new OutputPass();
composer.addPass(outputPass);
</pre>
<p>To use these classes we need to import a bunch of scripts.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {BloomPass} from 'three/addons/postprocessing/BloomPass.js';
import {FilmPass} from 'three/addons/postprocessing/FilmPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
</pre>
<p>For pretty much any post processing <code class="notranslate" translate="no">EffectComposer.js</code>, <code class="notranslate" translate="no">RenderPass.js</code> and <code class="notranslate" translate="no">OutputPass.js</code>
are required.</p>
<p>The last things we need to do are to use <code class="notranslate" translate="no">EffectComposer.render</code> instead of
<a href="/docs/#api/en/renderers/WebGLRenderer.render"><code class="notranslate" translate="no">WebGLRenderer.render</code></a> <em>and</em> to tell the <code class="notranslate" translate="no">EffectComposer</code> to match the size of
the canvas.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-function render(now) {
-  time *= 0.001;
+let then = 0;
+function render(now) {
+  now *= 0.001;  // convert to seconds
+  const deltaTime = now - then;
+  then = now;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
+    composer.setSize(canvas.width, canvas.height);
  }

  cubes.forEach((cube, ndx) =&gt; {
    const speed = 1 + ndx * .1;
-    const rot = time * speed;
+    const rot = now * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });

-  renderer.render(scene, camera);
+  composer.render(deltaTime);

  requestAnimationFrame(render);
}
</pre>
<p><code class="notranslate" translate="no">EffectComposer.render</code> takes a <code class="notranslate" translate="no">deltaTime</code> which is the time in seconds since
the last frame was rendered. It passes this to the various effects in case any
of them are animated. In this case the <code class="notranslate" translate="no">FilmPass</code> is animated.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/postprocessing.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/postprocessing.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>To change effect parameters at runtime usually requires setting uniform values.
Let's add a gui to adjust some of the parameters. Figuring out which values you
can easily adjust and how to adjust them requires digging through the code for
that effect.</p>
<p>Looking inside
<a href="https://github.com/mrdoob/three.js/blob/master/examples/jsm/postprocessing/BloomPass.js"><code class="notranslate" translate="no">BloomPass.js</code></a>
I found this line:</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">this.copyUniforms[ "opacity" ].value = strength;
</pre>
<p>So we can set the strength by setting</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">bloomPass.copyUniforms.opacity.value = someValue;
</pre>
<p>Similarly looking in
<a href="https://github.com/mrdoob/three.js/blob/master/examples/jsm/postprocessing/FilmPass.js"><code class="notranslate" translate="no">FilmPass.js</code></a>
I found these lines:</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">this.uniforms.intensity.value = intensity;
this.uniforms.grayscale.value = grayscale;
</pre>
<p>So which makes it pretty clear how to set them.</p>
<p>Let's make a quick GUI to set those values</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
</pre>
<p>and</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const gui = new GUI();
{
  const folder = gui.addFolder('BloomPass');
  folder.add(bloomPass.copyUniforms.opacity, 'value', 0, 2).name('strength');
  folder.open();
}
{
  const folder = gui.addFolder('FilmPass');
  folder.add(filmPass.uniforms.grayscale, 'value').name('grayscale');
  folder.add(filmPass.uniforms.intensity, 'value', 0, 1).name('intensity');
  folder.open();
}
</pre>
<p>and now we can adjust those settings</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/postprocessing-gui.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/postprocessing-gui.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>That was a small step to making our own effect.</p>
<p>Post processing effects use shaders. Shaders are written in a language called
<a href="https://www.khronos.org/files/opengles_shading_language.pdf">GLSL (Graphics Library Shading Language)</a>. Going
over the entire language is way too large a topic for these articles. A few
resources to get start from would be maybe <a href="https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html">this article</a>
and maybe <a href="https://thebookofshaders.com/">the Book of Shaders</a>.</p>
<p>I think an example to get you started would be helpful though so let's make a
simple GLSL post processing shader. We'll make one that lets us multiply the
image by a color.</p>
<p>For post processing THREE.js provides a useful helper called the <code class="notranslate" translate="no">ShaderPass</code>.
It takes an object with info defining a vertex shader, a fragment shader, and
the default inputs. It will handling setting up which texture to read from to
get the previous pass's results and where to render to, either one of the
<code class="notranslate" translate="no">EffectComposer</code>s render target or the canvas.</p>
<p>Here's a simple post processing shader that multiplies the previous pass's
result by a color. </p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const colorShader = {
  uniforms: {
    tDiffuse: { value: null },
    color:    { value: new THREE.Color(0x88CCFF) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform vec3 color;
    void main() {
      vec4 previousPassColor = texture2D(tDiffuse, vUv);
      gl_FragColor = vec4(
          previousPassColor.rgb * color,
          previousPassColor.a);
    }
  `,
};
</pre>
<p>Above <code class="notranslate" translate="no">tDiffuse</code> is the name that <code class="notranslate" translate="no">ShaderPass</code> uses to pass in the previous
pass's result texture so we pretty much always need that. We then declare
<code class="notranslate" translate="no">color</code> as a THREE.js <a href="/docs/#api/en/math/Color"><code class="notranslate" translate="no">Color</code></a>.</p>
<p>Next we need a vertex shader. For post processing the vertex shader shown here
is pretty much standard and rarely needs to be changed. Without going into too
many details (see articles linked above) the variables <code class="notranslate" translate="no">uv</code>, <code class="notranslate" translate="no">projectionMatrix</code>,
<code class="notranslate" translate="no">modelViewMatrix</code> and <code class="notranslate" translate="no">position</code> are all magically added by THREE.js.</p>
<p>Finally we create a fragment shader. In it we get a pixel color from the
previous pass with this line</p>
<pre class="prettyprint showlinemods notranslate lang-glsl" translate="no">vec4 previousPassColor = texture2D(tDiffuse, vUv);
</pre>
<p>we multiply it by our color and set <code class="notranslate" translate="no">gl_FragColor</code> to the result</p>
<pre class="prettyprint showlinemods notranslate lang-glsl" translate="no">gl_FragColor = vec4(
    previousPassColor.rgb * color,
    previousPassColor.a);
</pre>
<p>Adding some simple GUI to set the 3 values of the color</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const gui = new GUI();
gui.add(colorPass.uniforms.color.value, 'r', 0, 4).name('red');
gui.add(colorPass.uniforms.color.value, 'g', 0, 4).name('green');
gui.add(colorPass.uniforms.color.value, 'b', 0, 4).name('blue');
</pre>
<p>Gives us a simple postprocessing effect that multiplies by a color.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/postprocessing-custom.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/postprocessing-custom.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>As mentioned about all the details of how to write GLSL and custom shaders is
too much for these articles. If you really want to know how WebGL itself works
then check out <a href="https://webglfundamentals.org">these articles</a>. Another great
resources is just to
<a href="https://github.com/mrdoob/three.js/tree/master/examples/jsm/shaders">read through the existing post processing shaders in the THREE.js repo</a>. Some
are more complicated than others but if you start with the smaller ones you can
hopefully get an idea of how they work.</p>
<p>Most of the post processing effects in the THREE.js repo are unfortunately
undocumented so to use them you'll have to <a href="https://github.com/mrdoob/three.js/tree/master/examples">read through the examples</a> or
<a href="https://github.com/mrdoob/three.js/tree/master/examples/jsm/postprocessing">the code for the effects themselves</a>.
Hopefully these simple example and the article on
<a href="rendertargets.html">render targets</a> provide enough context to get started.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# prerequisites.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Prerequisites</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Prerequisites">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Prerequisites</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>These articles are meant to help you learn how to use three.js.
They assume you know how to program in JavaScript. They assume
you know what the DOM is, how to write HTML as well as create DOM elements
in JavaScript. They assume you know how to use
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import">es6 modules</a>
via import and via <code class="notranslate" translate="no">&lt;script type="module"&gt;</code> tags. They assume you know how to use import maps.
They assume you know some CSS and that you know what
<a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors">CSS selectors are</a>.
They also assume you know ES5, ES6 and maybe some ES7.
They assume you know that the browser runs JavaScript only via events and callbacks.
They assume you know what a closure is.</p>
<p>Here's some brief refreshers and notes</p>
<h2 id="es6-modules">es6 modules</h2>
<p>es6 modules can be loaded via the <code class="notranslate" translate="no">import</code> keyword in a script
or inline via a <code class="notranslate" translate="no">&lt;script type="module"&gt;</code> tag. Here's an example</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">
&lt;script type="importmap"&gt;
{
  "imports": {
    "three": "./path/to/three.module.js",
    "three/addons/": "./different/path/to/examples/jsm/"
  }
}
&lt;/script&gt;

&lt;script type="module"&gt;
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

...

&lt;/script&gt;
</pre>
<p>See more details at the bottom of <a href="fundamentals.html">this article</a>.</p>
<h2 id="-document-queryselector-and-document-queryselectorall-"><code class="notranslate" translate="no">document.querySelector</code> and <code class="notranslate" translate="no">document.querySelectorAll</code></h2>
<p>You can use <code class="notranslate" translate="no">document.querySelector</code> to select the first element
that matches a CSS selector. <code class="notranslate" translate="no">document.querySelectorAll</code> returns
all elements that match a CSS selector.</p>
<h2 id="you-don-t-need-onload-">You don't need <code class="notranslate" translate="no">onload</code></h2>
<p>Lots of 20yr old pages use HTML like</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">&lt;body onload="somefunction()"&gt;
</pre><p>That style is deprecated. Put your scripts
at the bottom of the page.</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;html&gt;
  &lt;head&gt;
    ...
  &lt;/head&gt;
  &lt;body&gt;
     ...
  &lt;/body&gt;
  &lt;script&gt;
    // inline javascript
  &lt;/script&gt;
&lt;/html&gt;
</pre>
<p>or <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script">use the <code class="notranslate" translate="no">defer</code> property</a>.</p>
<h2 id="know-how-closures-work">Know how closures work</h2>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function a(v) {
  const foo = v;
  return function() {
     return foo;
  };
}

const f = a(123);
const g = a(456);
console.log(f());  // prints 123
console.log(g());  // prints 456
</pre>
<p>In the code above the function <code class="notranslate" translate="no">a</code> creates a new function every time it's called. That
function <em>closes</em> over the variable <code class="notranslate" translate="no">foo</code>. Here's <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures">more info</a>.</p>
<h2 id="understand-how-this-works">Understand how <code class="notranslate" translate="no">this</code> works</h2>
<p><code class="notranslate" translate="no">this</code> is not magic. It's effectively a variable that is automatically passed to functions just like
an argument is passed to function. The simple explanation is when you call a function directly
like</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">somefunction(a, b, c);
</pre><p><code class="notranslate" translate="no">this</code> will be <code class="notranslate" translate="no">null</code> (when in strict mode or in a module) where as when you call a function via the dot operator <code class="notranslate" translate="no">.</code> like this</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">someobject.somefunction(a, b, c);
</pre><p><code class="notranslate" translate="no">this</code> will be set to <code class="notranslate" translate="no">someobject</code>.</p>
<p>The parts where people get confused is with callbacks.</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no"> const callback = someobject.somefunction;
 loader.load(callback);
</pre><p>doesn't work as someone inexperienced might expect because when
<code class="notranslate" translate="no">loader.load</code> calls the callback it's not calling it with the dot <code class="notranslate" translate="no">.</code> operator
so by default <code class="notranslate" translate="no">this</code> will be null (unless the loader explicitly sets it to something).
If you want <code class="notranslate" translate="no">this</code> to be <code class="notranslate" translate="no">someobject</code> when the callback happens you need to
tell JavaScript that by binding it to the function.</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no"> const callback = someobject.somefunction.bind(someobject);
 loader.load(callback);
</pre><p><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this"><em>this</em> article might help explain <code class="notranslate" translate="no">this</code></a>.</p>
<h2 id="es5-es6-es7-stuff">ES5/ES6/ES7 stuff</h2>
<h3 id="-var-is-deprecated-use-const-and-or-let-"><code class="notranslate" translate="no">var</code> is deprecated. Use <code class="notranslate" translate="no">const</code> and/or <code class="notranslate" translate="no">let</code></h3>
<p>There is no reason to use <code class="notranslate" translate="no">var</code> <strong>EVER</strong> and at this point it's considered bad practice
to use it at all. Use <code class="notranslate" translate="no">const</code> if the variable will never be reassigned which is most of
the time. Use <code class="notranslate" translate="no">let</code> in those cases where the value changes. This will help avoid tons of bugs.</p>
<h3 id="use-for-elem-of-collection-never-for-elem-in-collection-">Use <code class="notranslate" translate="no">for(elem of collection)</code> never <code class="notranslate" translate="no">for(elem in collection)</code></h3>
<p><code class="notranslate" translate="no">for of</code> is new, <code class="notranslate" translate="no">for in</code> is old. <code class="notranslate" translate="no">for in</code> had issues that are solved by <code class="notranslate" translate="no">for of</code></p>
<p>As one example you can iterate over all the key/value pairs of an object with</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">for (const [key, value] of Object.entries(someObject)) {
  console.log(key, value);
}
</pre>
<h3 id="use-foreach-map-and-filter-where-useful">Use <code class="notranslate" translate="no">forEach</code>, <code class="notranslate" translate="no">map</code>, and <code class="notranslate" translate="no">filter</code>  where useful</h3>
<p>Arrays added the functions <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach"><code class="notranslate" translate="no">forEach</code></a>,
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map"><code class="notranslate" translate="no">map</code></a>, and
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter"><code class="notranslate" translate="no">filter</code></a> and
are used fairly extensively in modern JavaScript.</p>
<h3 id="use-destructuring">Use destructuring</h3>
<p>Assume an object <code class="notranslate" translate="no">const dims = {width: 300, height: 150}</code></p>
<p>old code</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const width = dims.width;
const height = dims.height;
</pre>
<p>new code</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const {width, height} = dims;
</pre>
<p>Destructuring works with arrays too. Assume an array <code class="notranslate" translate="no">const position = [5, 6, 7, 1]</code>;</p>
<p>old code</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const y = position[1];
const z = position[2];
</pre>
<p>new code</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const [, y, z] = position;
</pre>
<p>Destructuring also works in function arguments</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const dims = {width: 300, height: 150};
const vector = [3, 4];

function lengthOfVector([x, y]) {
  return Math.sqrt(x * x + y * y);
}

const dist = lengthOfVector(vector);  // dist = 5

function area({width, height}) {
  return width * height;
}
const a = area(dims);  // a = 45000
</pre>
<h3 id="use-object-declaration-short-cuts">Use object declaration short cuts</h3>
<p>old code</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no"> const width = 300;
 const height = 150;
 const obj = {
   width: width,
   height: height,
   area: function() {
     return this.width * this.height
   },
 };
</pre>
<p>new code</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no"> const width = 300;
 const height = 150;
 const obj = {
   width,
   height,
   area() {
     return this.width * this.height;
   },
 };
</pre>
<h3 id="use-the-rest-parameter-and-the-spread-operator-">Use the rest parameter and the spread operator <code class="notranslate" translate="no">...</code></h3>
<p>The rest parameter can be used to consume any number of parameters. Example</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no"> function log(className, ...args) {
   const elem = document.createElement('div');
   elem.className = className;
   elem.textContent = args.join(' ');
   document.body.appendChild(elem);
 }
</pre>
<p>The spread operator can be used to expand an iterable into arguments</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const position = [1, 2, 3];
someMesh.position.set(...position);
</pre>
<p>or copy an array</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const copiedPositionArray = [...position];
copiedPositionArray.push(4); // [1,2,3,4]
console.log(position); // [1,2,3] position is unaffected
</pre>
<p>or to merge objects</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">const a = {abc: 123};
const b = {def: 456};
const c = {...a, ...b};  // c is now {abc: 123, def: 456}
</pre><h3 id="use-class-">Use <code class="notranslate" translate="no">class</code></h3>
<p>The syntax for making class like objects pre ES5 was unfamiliar to most
programmers. As of ES5 you can now <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes">use the <code class="notranslate" translate="no">class</code>
keyword</a>
which is closer to the style of C++/C#/Java.</p>
<h3 id="understand-getters-and-setters">Understand getters and setters</h3>
<p><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get">Getters</a> and
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set">setters</a> are
common in most modern languages. The <code class="notranslate" translate="no">class</code> syntax
of ES5 makes them much easier than pre ES5.</p>
<h3 id="use-arrow-functions-where-appropriate">Use arrow functions where appropriate</h3>
<p>This is especially useful with callbacks and promises.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">loader.load((texture) =&gt; {
  // use texture
});
</pre>
<p>Arrow functions bind <code class="notranslate" translate="no">this</code> to the context in which you create the arrow function.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const foo = (args) =&gt; {/* code */};
</pre>
<p>is a shortcut for</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const foo = (function(args) {/* code */}).bind(this));
</pre>
<p>See link above for more info on <code class="notranslate" translate="no">this</code>.</p>
<h3 id="promises-as-well-as-async-await">Promises as well as async/await</h3>
<p>Promises help with asynchronous code. Async/await help
use promises.</p>
<p>It's too big a topic to go into here but you can <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises">read up
on promises here</a>
and <a href="https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await">async/await here</a>.</p>
<h3 id="use-template-literals">Use Template Literals</h3>
<p>Template literals are strings using backticks instead of quotes.</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">const foo = `this is a template literal`;
</pre><p>Template literals have basically 2 features. One is they can be multi-line</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const foo = `this
is
a
template
literal`;
const bar = "this\nis\na\ntemplate\nliteral";
</pre>
<p><code class="notranslate" translate="no">foo</code> and <code class="notranslate" translate="no">bar</code> above are the same.</p>
<p>The other is that you can pop out of string mode and insert snippets of
JavaScript using <code class="notranslate" translate="no">${javascript-expression}</code>. This is the template part. Example:</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const r = 192;
const g = 255;
const b = 64;
const rgbCSSColor = `rgb(${r},${g},${b})`;
</pre>
<p>or</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const color = [192, 255, 64];
const rgbCSSColor = `rgb(${color.join(',')})`;
</pre>
<p>or</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const aWidth = 10;
const bWidth = 20;
someElement.style.width = `${aWidth + bWidth}px`;
</pre>
<h1 id="learn-javascript-coding-conventions-">Learn JavaScript coding conventions.</h1>
<p>While you're welcome to format your code any way you chose there is at least one
convention you should be aware of. Variables, function names, method names, in
JavaScript are all lowerCasedCamelCase. Constructors, the names of classes are
CapitalizedCamelCase. If you follow this rule you code will match most other
JavaScript. Many <a href="https://eslint.org">linters</a>, programs that check for obvious errors in your code,
will point out errors if you use the wrong case since by following the convention
above they can know when you're using something incorrectly.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const v = new vector(); // clearly an error if all classes start with a capital letter
const v = Vector();     // clearly an error if all functions start with a lowercase letter.
</pre>
<h1 id="consider-using-visual-studio-code">Consider using Visual Studio Code</h1>
<p>Of course use whatever editor you want but if you haven't tried it consider
using <a href="https://code.visualstudio.com/">Visual Studio Code</a> for JavaScript and
after installing it <a href="https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint">setup
eslint</a>.
It might take a few minutes to setup but it will help you immensely with finding
bugs in your JavaScript.</p>
<p>Some examples</p>
<p>If you enable <a href="https://eslint.org/docs/rules/no-undef">the <code class="notranslate" translate="no">no-undef</code> rule</a> then
VSCode via ESLint will warn you of many undefined variables. </p>
<div class="threejs_center"><img style="width: 615px;" src="../resources/images/vscode-eslint-not-defined.png"></div>

<p>Above you can see I mis-spelled <code class="notranslate" translate="no">doTheThing</code> as <code class="notranslate" translate="no">doThing</code>. There's a red squiggle
under <code class="notranslate" translate="no">doThing</code> and hovering over it it tells me it's undefined. One error
avoided.</p>
<p>If you're using <code class="notranslate" translate="no">&lt;script&gt;</code> tags to include three.js you'll get warnings using <code class="notranslate" translate="no">THREE</code> so add <code class="notranslate" translate="no">/* global THREE */</code> at the top of your
JavaScript files to tell eslint that <code class="notranslate" translate="no">THREE</code> exists. (or better, use <code class="notranslate" translate="no">import</code> 😉)</p>
<div class="threejs_center"><img style="width: 615px;" src="../resources/images/vscode-eslint-not-a-constructor.png"></div>

<p>Above you can see eslint knows the rule that <code class="notranslate" translate="no">UpperCaseNames</code> are constructors
and so you should be using <code class="notranslate" translate="no">new</code>. Another error caught and avoided. This is <a href="https://eslint.org/docs/rules/new-cap">the
<code class="notranslate" translate="no">new-cap</code> rule</a>.</p>
<p>There are <a href="https://eslint.org/docs/rules/">100s of rules you can turn on or off or
customize</a>. For example above I mentioned you
should use <code class="notranslate" translate="no">const</code> and <code class="notranslate" translate="no">let</code> over <code class="notranslate" translate="no">var</code>.</p>
<p>Here I used <code class="notranslate" translate="no">var</code> and it warned me I should use <code class="notranslate" translate="no">let</code> or <code class="notranslate" translate="no">const</code></p>
<div class="threejs_center"><img style="width: 615px;" src="../resources/images/vscode-eslint-var.png"></div>

<p>Here I used <code class="notranslate" translate="no">let</code> but it saw I never change the value so it suggested I use <code class="notranslate" translate="no">const</code>.</p>
<div class="threejs_center"><img style="width: 615px;" src="../resources/images/vscode-eslint-let.png"></div>

<p>Of course if you'd prefer to keep using <code class="notranslate" translate="no">var</code> you can just turn off that rule.
As I said above though I prefer to use <code class="notranslate" translate="no">const</code> and <code class="notranslate" translate="no">let</code> over <code class="notranslate" translate="no">var</code> as they just
work better and prevent bugs.</p>
<p>For those cases where you really need to override a rule <a href="https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments">you can add comments
to disable
them</a>
for a single line or a section of code.</p>
<h1 id="if-you-really-need-to-support-legacy-browsers-use-a-transpiler">If you really need to support legacy browsers use a transpiler</h1>
<p>Most modern browsers are auto-updated so using all these features will help you
be productive and avoid bugs. That said, if you're on a project that absolutely
must support old browsers there are <a href="https://babeljs.io">tools that will take your ES5/ES6/ES7 code
and transpile the code back to pre ES5 Javascript</a>.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>


# primitives.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Primitives</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Primitives">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Primitives</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This article is one in a series of articles about three.js.
The first article was <a href="fundamentals.html">about fundamentals</a>.
If you haven't read that yet you might want to start there.</p>
<p>Three.js has a large number of primitives. Primitives
are generally 3D shapes that are generated at runtime
with a bunch of parameters.</p>
<p>It's common to use primitives for things like a sphere
for a globe or a bunch of boxes to draw a 3D graph. It's
especially common to use primitives to experiment
and get started with 3D. For the majority of 3D apps
it's more common to have an artist make 3D models
in a 3D modeling program like <a href="https://blender.org">Blender</a>
or <a href="https://www.autodesk.com/products/maya/">Maya</a> or <a href="https://www.maxon.net/en-us/products/cinema-4d/">Cinema 4D</a>. Later in this series we'll
cover making and loading data from several 3D modeling
programs. For now let's go over some of the available
primitives.</p>
<p>Many of the primitives below have defaults for some or all of their
parameters so you can use more or less depending on your needs.</p>
<div id="Diagram-BoxGeometry" data-primitive="BoxGeometry">A Box</div>
<div id="Diagram-CircleGeometry" data-primitive="CircleGeometry">A flat circle</div>
<div id="Diagram-ConeGeometry" data-primitive="ConeGeometry">A Cone</div>
<div id="Diagram-CylinderGeometry" data-primitive="CylinderGeometry">A Cylinder</div>
<div id="Diagram-DodecahedronGeometry" data-primitive="DodecahedronGeometry">A dodecahedron (12 sides)</div>
<div id="Diagram-ExtrudeGeometry" data-primitive="ExtrudeGeometry">An extruded 2d shape with optional bevelling.
Here we are extruding a heart shape. Note this is the basis
for <a href="/docs/#api/en/geometries/TextGeometry"><code class="notranslate" translate="no">TextGeometry</code></a>.</div>
<div id="Diagram-IcosahedronGeometry" data-primitive="IcosahedronGeometry">An icosahedron (20 sides)</div>
<div id="Diagram-LatheGeometry" data-primitive="LatheGeometry">A shape generated by spinning a line. Examples would be: lamps, bowling pins, candles, candle holders, wine glasses, drinking glasses, etc... You provide the 2d silhouette as series of points and then tell three.js how many subdivisions to make as it spins the silhouette around an axis.</div>
<div id="Diagram-OctahedronGeometry" data-primitive="OctahedronGeometry">An Octahedron (8 sides)</div>
<div id="Diagram-ParametricGeometry" data-primitive="ParametricGeometry">A surface generated by providing a function that takes a 2D point from a grid and returns the corresponding 3d point.</div>
<div id="Diagram-PlaneGeometry" data-primitive="PlaneGeometry">A 2D plane</div>
<div id="Diagram-PolyhedronGeometry" data-primitive="PolyhedronGeometry">Takes a set of triangles centered around a point and projects them onto a sphere</div>
<div id="Diagram-RingGeometry" data-primitive="RingGeometry">A 2D disc with a hole in the center</div>
<div id="Diagram-ShapeGeometry" data-primitive="ShapeGeometry">A 2D outline that gets triangulated</div>
<div id="Diagram-SphereGeometry" data-primitive="SphereGeometry">A sphere</div>
<div id="Diagram-TetrahedronGeometry" data-primitive="TetrahedronGeometry">A tetrahedron (4 sides)</div>
<div id="Diagram-TextGeometry" data-primitive="TextGeometry">3D text generated from a 3D font and a string</div>
<div id="Diagram-TorusGeometry" data-primitive="TorusGeometry">A torus (donut)</div>
<div id="Diagram-TorusKnotGeometry" data-primitive="TorusKnotGeometry">A torus knot</div>
<div id="Diagram-TubeGeometry" data-primitive="TubeGeometry">A circle traced down a path</div>
<div id="Diagram-EdgesGeometry" data-primitive="EdgesGeometry">A helper object that takes another geometry as input and generates edges only if the angle between faces is greater than some threshold. For example if you look at the box at the top it shows a line going through each face showing every triangle that makes the box. Using an <a href="/docs/#api/en/geometries/EdgesGeometry"><code class="notranslate" translate="no">EdgesGeometry</code></a> instead the middle lines are removed. Adjust the thresholdAngle below and you'll see the edges below that threshold disappear.</div>
<div id="Diagram-WireframeGeometry" data-primitive="WireframeGeometry">Generates geometry that contains one line segment (2 points) per edge in the given geometry. Without this you'd often be missing edges or get extra edges since WebGL generally requires 2 points per line segment. For example if all you had was a single triangle there would only be 3 points. If you tried to draw it using a material with <code class="notranslate" translate="no">wireframe: true</code> you would only get a single line. Passing that triangle geometry to a <a href="/docs/#api/en/geometries/WireframeGeometry"><code class="notranslate" translate="no">WireframeGeometry</code></a> will generate a new geometry that has 3 lines segments using 6 points..</div>

<p>We'll go over creating custom geometry in <a href="custom-buffergeometry.html">another article</a>. For now
let's make an example creating each type of primitive. We'll start
with the <a href="responsive.html">examples from the previous article</a>.</p>
<p>Near the top let's set a background color</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const scene = new THREE.Scene();
+scene.background = new THREE.Color(0xAAAAAA);
</pre>
<p>This tells three.js to clear to lightish gray.</p>
<p>The camera needs to change position so that we can see all the
objects.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-const fov = 75;
+const fov = 40;
const aspect = 2;  // the canvas default
const near = 0.1;
-const far = 5;
+const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
-camera.position.z = 2;
+camera.position.z = 120;
</pre>
<p>Let's add a function, <code class="notranslate" translate="no">addObject</code>, that takes an x, y position and an <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> and adds
the object to the scene.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const objects = [];
const spread = 15;

function addObject(x, y, obj) {
  obj.position.x = x * spread;
  obj.position.y = y * spread;

  scene.add(obj);
  objects.push(obj);
}
</pre>
<p>Let's also make a function to create a random colored material.
We'll use a feature of <a href="/docs/#api/en/math/Color"><code class="notranslate" translate="no">Color</code></a> that lets you set a color
based on hue, saturation, and luminance.</p>
<p><code class="notranslate" translate="no">hue</code> goes from 0 to 1 around the color wheel with
red at 0, green at .33 and blue at .66. <code class="notranslate" translate="no">saturation</code>
goes from 0 to 1 with 0 having no color and 1 being
most saturated. <code class="notranslate" translate="no">luminance</code> goes from 0 to 1
with 0 being black, 1 being white and 0.5 being
the maximum amount of color. In other words
as <code class="notranslate" translate="no">luminance</code> goes from 0.0 to 0.5 the color
will go from black to <code class="notranslate" translate="no">hue</code>. From 0.5 to 1.0
the color will go from <code class="notranslate" translate="no">hue</code> to white.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function createMaterial() {
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
  });

  const hue = Math.random();
  const saturation = 1;
  const luminance = .5;
  material.color.setHSL(hue, saturation, luminance);

  return material;
}
</pre>
<p>We also passed <code class="notranslate" translate="no">side: THREE.DoubleSide</code> to the material.
This tells three to draw both sides of the triangles
that make up a shape. For a solid shape like a sphere
or a cube there's usually no reason to draw the
back sides of triangles as they all face inside the
shape. In our case though we are drawing a few things
like the <a href="/docs/#api/en/geometries/PlaneGeometry"><code class="notranslate" translate="no">PlaneGeometry</code></a> and the <a href="/docs/#api/en/geometries/ShapeGeometry"><code class="notranslate" translate="no">ShapeGeometry</code></a>
which are 2 dimensional and so have no inside. Without
setting <code class="notranslate" translate="no">side: THREE.DoubleSide</code> they would disappear
when looking at their back sides.</p>
<p>I should note that it's faster to draw when <strong>not</strong> setting
<code class="notranslate" translate="no">side: THREE.DoubleSide</code> so ideally we'd set it only on
the materials that really need it but in this case we
are not drawing too much so there isn't much reason to
worry about it.</p>
<p>Let's make a function, <code class="notranslate" translate="no">addSolidGeometry</code>, that
we pass a geometry and it creates a random colored
material via <code class="notranslate" translate="no">createMaterial</code> and adds it to the scene
via <code class="notranslate" translate="no">addObject</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function addSolidGeometry(x, y, geometry) {
  const mesh = new THREE.Mesh(geometry, createMaterial());
  addObject(x, y, mesh);
}
</pre>
<p>Now we can use this for the majority of the primitives we create.
For example creating a box</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const width = 8;
  const height = 8;
  const depth = 8;
  addSolidGeometry(-2, -2, new THREE.BoxGeometry(width, height, depth));
}
</pre>
<p>If you look in the code below you'll see a similar section for each type of geometry.</p>
<p>Here's the result:</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/primitives.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/primitives.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>There are a couple of notable exceptions to the pattern above.
The biggest is probably the <a href="/docs/#api/en/geometries/TextGeometry"><code class="notranslate" translate="no">TextGeometry</code></a>. It needs to load
3D font data before it can generate a mesh for the text.
That data loads asynchronously so we need to wait for it
to load before trying to create the geometry. By promisifiying
font loading we can make it mush easier.
We create a <a href="/docs/#api/en/loaders/FontLoader"><code class="notranslate" translate="no">FontLoader</code></a> and then a function <code class="notranslate" translate="no">loadFont</code> that returns
a promise that on resolve will give us the font. We then create
an <code class="notranslate" translate="no">async</code> function called <code class="notranslate" translate="no">doit</code> and load the font using <code class="notranslate" translate="no">await</code>.
And finally create the geometry and call <code class="notranslate" translate="no">addObject</code> to add it the scene.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const loader = new FontLoader();
  // promisify font loading
  function loadFont(url) {
    return new Promise((resolve, reject) =&gt; {
      loader.load(url, resolve, undefined, reject);
    });
  }

  async function doit() {
    const font = await loadFont('resources/threejs/fonts/helvetiker_regular.typeface.json');  /* threejs.org: url */
    const geometry = new TextGeometry('three.js', {
      font: font,
      size: 3.0,
      depth: .2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: .3,
      bevelSegments: 5,
    });
    const mesh = new THREE.Mesh(geometry, createMaterial());
    geometry.computeBoundingBox();
    geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1);

    const parent = new THREE.Object3D();
    parent.add(mesh);

    addObject(-1, -1, parent);
  }
  doit();
}
</pre>
<p>There's one other difference. We want to spin the text around its
center but by default three.js creates the text such that its center of rotation
is on the left edge. To work around this we can ask three.js to compute the bounding
box of the geometry. We can then call the <code class="notranslate" translate="no">getCenter</code> method
of the bounding box and pass it our mesh's position object.
<code class="notranslate" translate="no">getCenter</code> copies the center of the box into the position.
It also returns the position object so we can call <code class="notranslate" translate="no">multiplyScalar(-1)</code>
to position the entire object such that its center of rotation
is at the center of the object.</p>
<p>If we then just called <code class="notranslate" translate="no">addSolidGeometry</code> like with previous
examples it would set the position again which is
no good. So, in this case we create an <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> which
is the standard node for the three.js scene graph. <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a>
is inherited from <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> as well. We'll cover <a href="scenegraph.html">how the scene graph
works in another article</a>.
For now it's enough to know that
like DOM nodes, children are drawn relative to their parent.
By making an <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> and making our mesh a child of that
we can position the <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> wherever we want and still
keep the center offset we set earlier.</p>
<p>If we didn't do this the text would spin off center.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/primitives-text.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/primitives-text.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Notice the one on the left is not spinning around its center
whereas the one on the right is.</p>
<p>The other exceptions are the 2 line based examples for <a href="/docs/#api/en/geometries/EdgesGeometry"><code class="notranslate" translate="no">EdgesGeometry</code></a>
and <a href="/docs/#api/en/geometries/WireframeGeometry"><code class="notranslate" translate="no">WireframeGeometry</code></a>. Instead of calling <code class="notranslate" translate="no">addSolidGeometry</code> they call
<code class="notranslate" translate="no">addLineGeometry</code> which looks like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function addLineGeometry(x, y, geometry) {
  const material = new THREE.LineBasicMaterial({color: 0x000000});
  const mesh = new THREE.LineSegments(geometry, material);
  addObject(x, y, mesh);
}
</pre>
<p>It creates a black <a href="/docs/#api/en/materials/LineBasicMaterial"><code class="notranslate" translate="no">LineBasicMaterial</code></a> and then creates a <a href="/docs/#api/en/objects/LineSegments"><code class="notranslate" translate="no">LineSegments</code></a>
object which is a wrapper for <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> that helps three know you're rendering
line segments (2 points per segment).</p>
<p>Each of the primitives has several parameters you can pass on creation
and it's best to <a href="https://threejs.org/docs/">look in the documentation</a> for all of them rather than
repeat them here. You can also click the links above next to each shape
to take you directly to the docs for that shape.</p>
<p>There is one other pair of classes that doesn't really fit the patterns above. Those are
the <a href="/docs/#api/en/materials/PointsMaterial"><code class="notranslate" translate="no">PointsMaterial</code></a> and the <a href="/docs/#api/en/objects/Points"><code class="notranslate" translate="no">Points</code></a> class. <a href="/docs/#api/en/objects/Points"><code class="notranslate" translate="no">Points</code></a> is like <a href="/docs/#api/en/objects/LineSegments"><code class="notranslate" translate="no">LineSegments</code></a> above in that it takes a
a <a href="/docs/#api/en/core/BufferGeometry"><code class="notranslate" translate="no">BufferGeometry</code></a> but draws points at each vertex instead of lines.
To use it you also need to pass it a <a href="/docs/#api/en/materials/PointsMaterial"><code class="notranslate" translate="no">PointsMaterial</code></a> which
take a <a href="/docs/#api/en/materials/PointsMaterial#size"><code class="notranslate" translate="no">size</code></a> for how large to make the points.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const radius = 7;
const widthSegments = 12;
const heightSegments = 8;
const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
const material = new THREE.PointsMaterial({
    color: 'red',
    size: 0.2,     // in world units
});
const points = new THREE.Points(geometry, material);
scene.add(points);
</pre>
<div class="spread">
<div data-diagram="Points"></div>
</div>

<p>You can turn off <a href="/docs/#api/en/materials/PointsMaterial#sizeAttenuation"><code class="notranslate" translate="no">sizeAttenuation</code></a> by setting it to false if you want the points to
be the same size regardless of their distance from the camera.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const material = new THREE.PointsMaterial({
    color: 'red',
+    sizeAttenuation: false,
+    size: 3,       // in pixels
-    size: 0.2,     // in world units
});
...
</pre>
<div class="spread">
<div data-diagram="PointsUniformSize"></div>
</div>

<p>One other thing that's important to cover is that almost all shapes
have various settings for how much to subdivide them. A good example
might be the sphere geometries. Spheres take parameters for
how many divisions to make around and how many top to bottom. For example</p>
<div class="spread">
<div data-diagram="SphereGeometryLow"></div>
<div data-diagram="SphereGeometryMedium"></div>
<div data-diagram="SphereGeometryHigh"></div>
</div>

<p>The first sphere has 5 segments around and 3 high which is 15 segments
or 30 triangles. The second sphere has 24 segments by 10. That's 240 segments
or 480 triangles. The last one has 50 by 50 which is 2500 segments or 5000 triangles.</p>
<p>It's up to you to decide how many subdivisions you need. It might
look like you need a high number of segments but remove the lines
and the flat shading and we get this</p>
<div class="spread">
<div data-diagram="SphereGeometryLowSmooth"></div>
<div data-diagram="SphereGeometryMediumSmooth"></div>
<div data-diagram="SphereGeometryHighSmooth"></div>
</div>

<p>It's now not so clear that the one on the right with 5000 triangles
is entirely better than the one in the middle with only 480.
If you're only drawing a few spheres, like say a single globe for
a map of the earth, then a single 10000 triangle sphere is not a bad
choice. If on the other hand you're trying to draw 1000 spheres
then 1000 spheres times 10000 triangles each is 10 million triangles.
To animate smoothly you need the browser to draw at 60 frames per
second so you'd be asking the browser to draw 600 million triangles
per second. That's a lot of computing.</p>
<p>Sometimes it's easy to choose. For example you can also choose
to subdivide a plane.</p>
<div class="spread">
<div data-diagram="PlaneGeometryLow"></div>
<div data-diagram="PlaneGeometryHigh"></div>
</div>

<p>The plane on the left is 2 triangles. The plane on the right
is 200 triangles. Unlike the sphere there is really no trade off in quality for most
use cases of a plane. You'd most likely only subdivide a plane
if you expected to want to modify or warp it in some way. A box
is similar.</p>
<p>So, choose whatever is appropriate for your situation. The less
subdivisions you choose the more likely things will run smoothly and the less
memory they'll take. You'll have to decide for yourself what the correct
tradeoff is for your particular situation.</p>
<p>If none of the shapes above fit your use case you can load
geometry for example from a <a href="load-obj.html">.obj file</a>
or a <a href="load-gltf.html">.gltf file</a>.
You can also create your own <a href="custom-buffergeometry.html">custom BufferGeometry</a>.</p>
<p>Next up let's go over <a href="scenegraph.html">how three's scene graph works and how
to use it</a>.</p>
<p><link rel="stylesheet" href="../resources/threejs-primitives.css"></p>
<script type="module" src="../resources/threejs-primitives.js"></script>


        </div>
      </div>
    </div>

  <script defer src="../resources/prettify.js"></script>
  <script defer src="../resources/lesson.js"></script>




</body></html>

# rendering-on-demand.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Rendering on Demand</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Rendering on Demand">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Rendering on Demand</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>The topic might be obvious to many people but just in case ... most Three.js
examples render continuously. In other words they setup a
<code class="notranslate" translate="no">requestAnimationFrame</code> loop or "<em>rAF loop</em>" something like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render() {
  ...
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
</pre>
<p>For something that animates this makes sense but what about for something that
does not animate? In that case rendering continuously is a waste of the devices
power and if the user is on portable device it wastes the user's battery. </p>
<p>The most obvious way to solve this is to render once at the start and then
render only when something changes. Changes include textures or models finally
loading, data arriving from some external source, the user adjusting a setting
or the camera or giving other relevant input.</p>
<p>Let's take an example from <a href="responsive.html">the article on responsiveness</a>
and modify it to render on demand.</p>
<p>First we'll add in the <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> so there is something that could change
that we can render in response to.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import * as THREE from 'three';
+import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
</pre>
<p>and set them up</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

+const controls = new OrbitControls(camera, canvas);
+controls.target.set(0, 0, 0);
+controls.update();
</pre>
<p>Since we won't be animating the cubes anymore we no longer need to keep track of them</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-const cubes = [
-  makeInstance(geometry, 0x44aa88,  0),
-  makeInstance(geometry, 0x8844aa, -2),
-  makeInstance(geometry, 0xaa8844,  2),
-];
+makeInstance(geometry, 0x44aa88,  0);
+makeInstance(geometry, 0x8844aa, -2);
+makeInstance(geometry, 0xaa8844,  2);
</pre>
<p>We can remove the code to animate the cubes and the calls to <code class="notranslate" translate="no">requestAnimationFrame</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-function render(time) {
-  time *= 0.001;
+function render() {

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

-  cubes.forEach((cube, ndx) =&gt; {
-    const speed = 1 + ndx * .1;
-    const rot = time * speed;
-    cube.rotation.x = rot;
-    cube.rotation.y = rot;
-  });

  renderer.render(scene, camera);

-  requestAnimationFrame(render);
}

-requestAnimationFrame(render);
</pre>
<p>then we need to render once</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">render();
</pre>
<p>We need to render anytime the <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> change the camera settings.
Fortunately the <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> dispatch a <code class="notranslate" translate="no">change</code> event anytime something
changes.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">controls.addEventListener('change', render);
</pre>
<p>We also need to handle the case where the user resizes the window. That was
handled automatically before since we were rendering continuously but now what
we are not we need to render when the window changes size.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">window.addEventListener('resize', render);
</pre>
<p>And with that we get something that renders on demand.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/render-on-demand.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/render-on-demand.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>The <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> have options to add a kind of inertia to make them feel less
stiff. We can enable this by setting the <code class="notranslate" translate="no">enableDamping</code> property to true.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">controls.enableDamping = true;
</pre>
<p>With <code class="notranslate" translate="no">enableDamping</code> on we need to call <code class="notranslate" translate="no">controls.update</code> in our render function
so that the <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a> can continue to give us new camera settings as they
smooth out the movement. But, that means we can't call <code class="notranslate" translate="no">render</code> directly from
the <code class="notranslate" translate="no">change</code> event because we'll end up in an infinite loop. The controls will
send us a <code class="notranslate" translate="no">change</code> event and call <code class="notranslate" translate="no">render</code>, <code class="notranslate" translate="no">render</code> will call <code class="notranslate" translate="no">controls.update</code>.
<code class="notranslate" translate="no">controls.update</code> will send another <code class="notranslate" translate="no">change</code> event.</p>
<p>We can fix that by using <code class="notranslate" translate="no">requestAnimationFrame</code> to call <code class="notranslate" translate="no">render</code> but we need to
make sure we only ask for a new frame if one has not already been requested
which we can do by keeping a variable that tracks if we've already requested a frame.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+let renderRequested = false;

function render() {
+  renderRequested = false;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  renderer.render(scene, camera);
}
render();

+function requestRenderIfNotRequested() {
+  if (!renderRequested) {
+    renderRequested = true;
+    requestAnimationFrame(render);
+  }
+}

-controls.addEventListener('change', render);
+controls.addEventListener('change', requestRenderIfNotRequested);
</pre>
<p>We should probably also use <code class="notranslate" translate="no">requestRenderIfNotRequested</code> for resizing as well</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-window.addEventListener('resize', render);
+window.addEventListener('resize', requestRenderIfNotRequested);
</pre>
<p>It might be hard to see the difference. Try clicking on the example below and
use the arrow keys to move around or dragging to spin. Then try clicking on the
example above and do the same thing and you should be able to tell the
difference. The one above snaps when you press an arrow key or drag, the one
below slides.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/render-on-demand-w-damping.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/render-on-demand-w-damping.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Let's also add a simple lil-gui GUI and make its changes render on demand.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
+import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
</pre>
<p>Let's allow setting the color and x scale of each cube. To be able to set the
color we'll use the <code class="notranslate" translate="no">ColorGUIHelper</code> we created in the <a href="lights.html">article on
lights</a>.</p>
<p>First we need to create a GUI</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const gui = new GUI();
</pre>
<p>and then for each cube we'll create a folder and add 2 controls, one for
<code class="notranslate" translate="no">material.color</code> and another for <code class="notranslate" translate="no">cube.scale.x</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function makeInstance(geometry, color, x) {
  const material = new THREE.MeshPhongMaterial({color});

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.x = x;

+  const folder = gui.addFolder(`Cube${x}`);
+  folder.addColor(new ColorGUIHelper(material, 'color'), 'value')
+      .name('color')
+      .onChange(requestRenderIfNotRequested);
+  folder.add(cube.scale, 'x', .1, 1.5)
+      .name('scale x')
+      .onChange(requestRenderIfNotRequested);
+  folder.open();

  return cube;
}
</pre>
<p>You can see above lil-gui controls have an <code class="notranslate" translate="no">onChange</code> method that you can pass a
callback to be called when the GUI changes a value. In our case we just need it
to call <code class="notranslate" translate="no">requestRenderIfNotRequested</code>. The call to <code class="notranslate" translate="no">folder.open</code> makes the
folder start expanded.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/render-on-demand-w-gui.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/render-on-demand-w-gui.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>I hope this gives some idea of how to make three.js render on demand instead of
continuously. Apps/pages that render three.js on demand are not as common as
most pages using three.js are either games or 3D animated art but examples of
pages that might be better rendering on demand would be say a map viewer, a 3d
editor, a 3d graph generator, a product catalog, etc...</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# rendertargets.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Render Targets</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Render Targets">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Render Targets</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>A render target in three.js is basically a texture you can render to.
After you render to it you can use that texture like any other texture.</p>
<p>Let's make a simple example. We'll start with an example from <a href="responsive.html">the article on responsiveness</a>.</p>
<p>Rendering to a render target is almost exactly the same as normal rendering. First we create a <a href="/docs/#api/en/renderers/WebGLRenderTarget"><code class="notranslate" translate="no">WebGLRenderTarget</code></a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const rtWidth = 512;
const rtHeight = 512;
const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
</pre>
<p>Then we need a <a href="/docs/#api/en/cameras/Camera"><code class="notranslate" translate="no">Camera</code></a> and a <a href="/docs/#api/en/scenes/Scene"><code class="notranslate" translate="no">Scene</code></a></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const rtFov = 75;
const rtAspect = rtWidth / rtHeight;
const rtNear = 0.1;
const rtFar = 5;
const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
rtCamera.position.z = 2;

const rtScene = new THREE.Scene();
rtScene.background = new THREE.Color('red');
</pre>
<p>Notice we set the aspect to the aspect for the render target, not the canvas.
The correct aspect to use depends on what we are rendering for. In this case
we'll use the render target's texture on the side of a cube. Since faces of
the cube are square we want an aspect of 1.0.</p>
<p>We fill the scene with stuff. In this case we're using the light and the 3 cubes <a href="responsive.html">from the previous article</a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
*  rtScene.add(light);
}

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

function makeInstance(geometry, color, x) {
  const material = new THREE.MeshPhongMaterial({color});

  const cube = new THREE.Mesh(geometry, material);
*  rtScene.add(cube);

  cube.position.x = x;

  return cube;
}

*const rtCubes = [
  makeInstance(geometry, 0x44aa88,  0),
  makeInstance(geometry, 0x8844aa, -2),
  makeInstance(geometry, 0xaa8844,  2),
];
</pre>
<p>The <a href="/docs/#api/en/scenes/Scene"><code class="notranslate" translate="no">Scene</code></a> and <a href="/docs/#api/en/cameras/Camera"><code class="notranslate" translate="no">Camera</code></a> from the previous article are still there. We'll use them to render to the canvas.
We just need to add stuff to render.</p>
<p>Let's add a cube that uses the render target's texture.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const material = new THREE.MeshPhongMaterial({
  map: renderTarget.texture,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
</pre>
<p>Now at render time first we render the render target scene to the render target.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {
  time *= 0.001;

  ...

  // rotate all the cubes in the render target scene
  rtCubes.forEach((cube, ndx) =&gt; {
    const speed = 1 + ndx * .1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });

  // draw render target scene to render target
  renderer.setRenderTarget(renderTarget);
  renderer.render(rtScene, rtCamera);
  renderer.setRenderTarget(null);
</pre>
<p>Then we render the scene with the single cube that is using the render target's texture to the canvas.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">  // rotate the cube in the scene
  cube.rotation.x = time;
  cube.rotation.y = time * 1.1;

  // render the scene to the canvas
  renderer.render(scene, camera);
</pre>
<p>And voilà</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/render-target.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/render-target.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>The cube is red because we set the <code class="notranslate" translate="no">background</code> of the <code class="notranslate" translate="no">rtScene</code> to red so the
render target's texture is being cleared to red.</p>
<p>Render targets are used for all kinds of things. <a href="shadows.html">Shadows</a> use render targets.
<a href="picking.html">Picking can use a render target</a>. Various kinds of
<a href="post-processing.html">post processing effects</a> require render targets.
Rendering a rear view mirror in a car or a live view on a monitor inside a 3D
scene might use a render target.</p>
<p>A few notes about using <a href="/docs/#api/en/renderers/WebGLRenderTarget"><code class="notranslate" translate="no">WebGLRenderTarget</code></a>.</p>
<ul>
<li><p>By default <a href="/docs/#api/en/renderers/WebGLRenderTarget"><code class="notranslate" translate="no">WebGLRenderTarget</code></a> creates 2 textures. A color texture and a depth/stencil texture. If you don't need the depth or stencil textures you can request to not create them by passing in options. Example:</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">  const rt = new THREE.WebGLRenderTarget(width, height, {
    depthBuffer: false,
    stencilBuffer: false,
  });
</pre>
</li>
<li><p>You might need to change the size of a render target</p>
<p>In the example above we make a render target of a fixed size, 512x512. For things like post processing you generally need to make a render target the same size as your canvas. In our code that would mean when we change the canvas size we would also update both the render target size and the camera we're using when rendering to the render target. Example:</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">function render(time) {
  time *= 0.001;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

+    renderTarget.setSize(canvas.width, canvas.height);
+    rtCamera.aspect = camera.aspect;
+    rtCamera.updateProjectionMatrix();
}
</pre></li>
</ul>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# responsive.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Responsive Design</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Responsive Design">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Responsive Design</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This is the second article in a series of articles about three.js.
The first article was <a href="fundamentals.html">about fundamentals</a>.
If you haven't read that yet you might want to start there.</p>
<p>This article is about how to make your three.js app be responsive
to any situation. Making a webpage responsive generally refers
to the page displaying well on different sized displays from
desktops to tablets to phones.</p>
<p>For three.js there are even more situations to consider. For
example, a 3D editor with controls on the left, right, top, or
bottom is something we might want to handle. A live diagram
in the middle of a document is another example.</p>
<p>The last sample we had used a plain canvas with no CSS and
no size</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;canvas id="c"&gt;&lt;/canvas&gt;
</pre>
<p>That canvas defaults to 300x150 CSS pixels in size.</p>
<p>In the web platform the recommended way to set the size
of something is to use CSS.</p>
<p>Let's make the canvas fill the page by adding CSS</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;style&gt;
html, body {
   margin: 0;
   height: 100%;
}
#c {
   width: 100%;
   height: 100%;
   display: block;
}
&lt;/style&gt;
</pre>
<p>In HTML the body has a margin of 5 pixels by default so setting the
margin to 0 removes the margin. Setting the html and body height to 100%
makes them fill the window. Otherwise they are only as large
as the content that fills them.</p>
<p>Next we tell the <code class="notranslate" translate="no">id=c</code> element to be
100% the size of its container which in this case is the body of
the document.</p>
<p>Finally we set its <code class="notranslate" translate="no">display</code> mode to <code class="notranslate" translate="no">block</code>. A canvas's
default display mode is <code class="notranslate" translate="no">inline</code>. Inline
elements can end up adding whitespace to what is displayed. By
setting the canvas to <code class="notranslate" translate="no">block</code> that issue goes away.</p>
<p>Here's the result</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/responsive-no-resize.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/responsive-no-resize.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>You can see the canvas is now filling the page but there are 2
problems. One our cubes are stretched. They are not cubes they
are more like boxes. Too tall or too wide. Open the
example in its own window and resize it. You'll see how
the cubes get stretched wide and tall.</p>
<p><img src="../resources/images/resize-incorrect-aspect.png" width="407" class="threejs_center nobg"></p>
<p>The second problem is they look low resolution or blocky and
blurry. Stretch the window really large and you'll really see
the issue.</p>
<p><img src="../resources/images/resize-low-res.png" class="threejs_center nobg"></p>
<p>Let's fix the stretchy problem first. To do that we need
to set the aspect of the camera to the aspect of the canvas's
display size. We can do that by looking at the canvas's
<code class="notranslate" translate="no">clientWidth</code> and <code class="notranslate" translate="no">clientHeight</code> properties.</p>
<p>We'll update our render loop like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {
  time *= 0.001;

+  const canvas = renderer.domElement;
+  camera.aspect = canvas.clientWidth / canvas.clientHeight;
+  camera.updateProjectionMatrix();

  ...
</pre>
<p>Now the cubes should stop being distorted.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/responsive-update-camera.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/responsive-update-camera.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Open the example in a separate window and resize the window
and you should see the cubes are no longer stretched tall or wide.
They stay the correct aspect regardless of window size.</p>
<p><img src="../resources/images/resize-correct-aspect.png" width="407" class="threejs_center nobg"></p>
<p>Now let's fix the blockiness.</p>
<p>Canvas elements have 2 sizes. One size is the size the canvas is displayed
on the page. That's what we set with CSS. The other size is the
number of pixels in the canvas itself. This is no different than an image.
For example we might have a 128x64 pixel image and using
CSS we might display as 400x200 pixels.</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;img src="some128x64image.jpg" style="width:400px; height:200px"&gt;
</pre>
<p>A canvas's internal size, its resolution, is often called its drawingbuffer size.
In three.js we can set the canvas's drawingbuffer size by calling <code class="notranslate" translate="no">renderer.setSize</code>.
What size should we pick? The most obvious answer is "the same size the canvas is displayed".
Again, to do that we can look at the canvas's <code class="notranslate" translate="no">clientWidth</code> and <code class="notranslate" translate="no">clientHeight</code>
properties.</p>
<p>Let's write a function that checks if the renderer's canvas is not
already the size it is being displayed as and if so set its size.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
</pre>
<p>Notice we check if the canvas actually needs to be resized. Resizing the canvas
is an interesting part of the canvas spec and it's best not to set the same
size if it's already the size we want.</p>
<p>Once we know if we need to resize or not we then call <code class="notranslate" translate="no">renderer.setSize</code> and
pass in the new width and height. It's important to pass <code class="notranslate" translate="no">false</code> at the end.
<code class="notranslate" translate="no">render.setSize</code> by default sets the canvas's CSS size but doing so is not
what we want. We want the browser to continue to work how it does for all other
elements which is to use CSS to determine the display size of the element. We don't
want canvases used by three to be different than other elements.</p>
<p>Note that our function returns true if the canvas was resized. We can use
this to check if there are other things we should update. Let's modify
our render loop to use the new function</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {
  time *= 0.001;

+  if (resizeRendererToDisplaySize(renderer)) {
+    const canvas = renderer.domElement;
+    camera.aspect = canvas.clientWidth / canvas.clientHeight;
+    camera.updateProjectionMatrix();
+  }

  ...
</pre>
<p>Since the aspect is only going to change if the canvas's display size
changed we only set the camera's aspect if <code class="notranslate" translate="no">resizeRendererToDisplaySize</code>
returns <code class="notranslate" translate="no">true</code>.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/responsive.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/responsive.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>It should now render with a resolution that matches the display
size of the canvas.</p>
<p>To make the point about letting CSS handle the resizing let's take
our code and put it in a <a href="../examples/threejs-responsive.js">separate <code class="notranslate" translate="no">.js</code> file</a>.
Here then are a few more examples where we let CSS choose the size and notice we had
to change zero code for them to work.</p>
<p>Let's put our cubes in the middle of a paragraph of text.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/responsive-paragraph.html&amp;startPane=html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/responsive-paragraph.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>and here's our same code used in an editor style layout
where the control area on the right can be resized.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/responsive-editor.html&amp;startPane=html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/responsive-editor.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>The important part to notice is no code changed. Only our HTML and CSS
changed.</p>
<h2 id="handling-hd-dpi-displays">Handling HD-DPI displays</h2>
<p>HD-DPI stands for high-density dot per inch displays.
That's most Macs nowadays and many Windows machines
as well as pretty much all smartphones.</p>
<p>The way this works in the browser is they use
CSS pixels to set the sizes which are supposed to be the same
regardless of how high res the display is. The browser
will just render text with more detail but the
same physical size.</p>
<p>There are various ways to handle HD-DPI with three.js.</p>
<p>The first one is just not to do anything special. This
is arguably the most common. Rendering 3D graphics
takes a lot of GPU processing power. Mobile GPUs have
less power than desktops, at least as of 2018, and yet
mobile phones often have very high resolution displays.
The current top of the line phones have an HD-DPI ratio
of 3x meaning for every one pixel from a non-HD-DPI display
those phones have 9 pixels. That means they have to do 9x
the rendering.</p>
<p>Computing 9x the pixels is a lot of work so if we just
leave the code as it is we'll compute 1x the pixels and the
browser will just draw it at 3x the size (3x by 3x = 9x pixels).</p>
<p>For any heavy three.js app that's probably what you want
otherwise you're likely to get a slow framerate.</p>
<p>That said if you actually do want to render at the resolution
of the device there are a couple of ways to do this in three.js.</p>
<p>One is to tell three.js a resolution multiplier using <code class="notranslate" translate="no">renderer.setPixelRatio</code>.
You ask the browser what the multiplier is from CSS pixels to device pixels
and pass that to three.js</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no"> renderer.setPixelRatio(window.devicePixelRatio);
</pre><p>After that any calls to <code class="notranslate" translate="no">renderer.setSize</code> will magically
use the size you request multiplied by whatever pixel ratio
you passed in. <strong>This is strongly NOT RECOMMENDED</strong>. See below</p>
<p>The other way is to do it yourself when you resize the canvas.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width  = Math.floor( canvas.clientWidth  * pixelRatio );
      const height = Math.floor( canvas.clientHeight * pixelRatio );
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }
</pre>
<p>This second way is objectively better. Why? Because it means I get what I ask for.
There are many cases when using three.js where we need to know the actual
size of the canvas's drawingBuffer. For example when making a post processing filter,
or if we are making a shader that accesses <code class="notranslate" translate="no">gl_FragCoord</code>, if we are making
a screenshot, or reading pixels for GPU picking, for drawing into a 2D canvas,
etc... There are many cases where if we use <code class="notranslate" translate="no">setPixelRatio</code> then our actual size will be different
than the size we requested and we'll have to guess when to use the size
we asked for and when to use the size three.js is actually using.
By doing it ourselves we always know the size being used is the size we requested.
There is no special case where magic is happening behind the scenes.</p>
<p>Here's an example using the code above.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/responsive-hd-dpi.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/responsive-hd-dpi.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>It might be hard to see the difference but if you have an HD-DPI
display and you compare this sample to those above you should
notice the edges are more crisp.</p>
<p>This article covered a very basic but fundamental topic. Next up lets quickly
<a href="primitives.html">go over the basic primitives that three.js provides</a>.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# scenegraph.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Scene Graph</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Scene Graph">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Scene Graph</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This article is part of a series of articles about three.js. The
first article is <a href="fundamentals.html">three.js fundamentals</a>. If
you haven't read that yet you might want to consider starting there.</p>
<p>Three.js's core is arguably its scene graph. A scene graph in a 3D
engine is a hierarchy of nodes in a graph where each node represents
a local space.</p>
<p><img src="../resources/images/scenegraph-generic.svg" align="center"></p>
<p>That's kind of abstract so let's try to give some examples.</p>
<p>One example might be solar system, sun, earth, moon.</p>
<p><img src="../resources/images/scenegraph-solarsystem.svg" align="center"></p>
<p>The Earth orbits the Sun. The Moon orbits the Earth. The Moon
moves in a circle around the Earth. From the Moon's point of
view it's rotating in the "local space" of the Earth. Even though
its motion relative to the Sun is some crazy spirograph like
curve from the Moon's point of view it just has to concern itself with rotating
around the Earth's local space.</p>
<p></p><div class="threejs_diagram_container">
  <iframe class="threejs_diagram " style="width: 400px; height: 300px;" src="/manual/foo/../resources/moon-orbit.html"></iframe>
</div>

<p></p>
<p>To think of it another way, you living on the Earth do not have to think
about the Earth's rotation on its axis nor its rotation around the
Sun. You just walk or drive or swim or run as though the Earth is
not moving or rotating at all. You walk, drive, swim, run, and live
in the Earth's "local space" even though relative to the sun you are
spinning around the earth at around 1000 miles per hour and around
the sun at around 67,000 miles per hour. Your position in the solar
system is similar to that of the moon above but you don't have to concern
yourself. You just worry about your position relative to the earth in its
"local space".</p>
<p>Let's take it one step at a time. Imagine we want to make
a diagram of the sun, earth, and moon. We'll start with the sun by
just making a sphere and putting it at the origin. Note: We're using
sun, earth, moon as a demonstration of how to use a scene graph. Of course
the real sun, earth, and moon use physics but for our purposes we'll
fake it with a scene graph.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// an array of objects whose rotation to update
const objects = [];

// use just one sphere for everything
const radius = 1;
const widthSegments = 6;
const heightSegments = 6;
const sphereGeometry = new THREE.SphereGeometry(
    radius, widthSegments, heightSegments);

const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00});
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);  // make the sun large
scene.add(sunMesh);
objects.push(sunMesh);
</pre>
<p>We're using a really low-polygon sphere. Only 6 subdivisions around its equator.
This is so it's easy to see the rotation.</p>
<p>We're going to reuse the same sphere for everything so we'll set a scale
for the sun mesh of 5x.</p>
<p>We also set the phong material's <code class="notranslate" translate="no">emissive</code> property to yellow. A phong material's
emissive property is basically the color that will be drawn with no light hitting
the surface. Light is added to that color.</p>
<p>Let's also put a single point light in the center of the scene. We'll go into more
details about point lights later but for now the simple version is a point light
represents light that emanates from a single point.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const color = 0xFFFFFF;
  const intensity = 3;
  const light = new THREE.PointLight(color, intensity);
  scene.add(light);
}
</pre>
<p>To make it easy to see we're going to put the camera directly above the origin
looking down. The easiest way to do that is to use the <code class="notranslate" translate="no">lookAt</code> function. The <code class="notranslate" translate="no">lookAt</code>
function will orient the camera from its position to "look at" the position
we pass to <code class="notranslate" translate="no">lookAt</code>. Before we do that though we need to tell the camera
which way the top of the camera is facing or rather which way is "up" for the
camera. For most situations positive Y being up is good enough but since
we are looking straight down we need to tell the camera that positive Z is up.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);
</pre>
<p>In the render loop, adapted from previous examples, we're rotating all
objects in our <code class="notranslate" translate="no">objects</code> array with this code.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">objects.forEach((obj) =&gt; {
  obj.rotation.y = time;
});
</pre>
<p>Since we added the <code class="notranslate" translate="no">sunMesh</code> to the <code class="notranslate" translate="no">objects</code> array it will rotate.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/scenegraph-sun.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/scenegraph-sun.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Now let's add in the earth.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthMesh.position.x = 10;
scene.add(earthMesh);
objects.push(earthMesh);
</pre>
<p>We make a material that is blue but we gave it a small amount of <em>emissive</em> blue
so that it will show up against our black background.</p>
<p>We use the same <code class="notranslate" translate="no">sphereGeometry</code> with our new blue <code class="notranslate" translate="no">earthMaterial</code> to make
an <code class="notranslate" translate="no">earthMesh</code>. We position that 10 units to the left of the sun
and add it to the scene.  Since we added it to our <code class="notranslate" translate="no">objects</code> array it will
rotate too.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/scenegraph-sun-earth.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/scenegraph-sun-earth.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>You can see both the sun and the earth are rotating but the earth is not
going around the sun. Let's make the earth a child of the sun</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-scene.add(earthMesh);
+sunMesh.add(earthMesh);
</pre>
<p>and...</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/scenegraph-sun-earth-orbit.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/scenegraph-sun-earth-orbit.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>What happened? Why is the earth the same size as the sun and why is it so far away?
I actually had to move the camera from 50 units above to 150 units above to see the earth.</p>
<p>We made the <code class="notranslate" translate="no">earthMesh</code> a child of the <code class="notranslate" translate="no">sunMesh</code>. The <code class="notranslate" translate="no">sunMesh</code> has
its scale set to 5x with <code class="notranslate" translate="no">sunMesh.scale.set(5, 5, 5)</code>. That means the
<code class="notranslate" translate="no">sunMesh</code>s local space is 5 times as big. Anything put in that space
 will be multiplied by 5. That means the earth is now 5x larger and
 its distance from the sun (<code class="notranslate" translate="no">earthMesh.position.x = 10</code>) is also
 5x as well.</p>
<p> Our scene graph currently looks like this</p>
<p><img src="../resources/images/scenegraph-sun-earth.svg" align="center"></p>
<p>To fix it let's add an empty scene graph node. We'll parent both the sun and the earth
to that node.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const solarSystem = new THREE.Object3D();
+scene.add(solarSystem);
+objects.push(solarSystem);

const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00});
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);
-scene.add(sunMesh);
+solarSystem.add(sunMesh);
objects.push(sunMesh);

const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthMesh.position.x = 10;
-sunMesh.add(earthMesh);
+solarSystem.add(earthMesh);
objects.push(earthMesh);
</pre>
<p>Here we made an <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a>. Like a <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> it is also a node in the scene graph
but unlike a <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> it has no material or geometry. It just represents a local space.</p>
<p>Our new scene graph looks like this</p>
<p><img src="../resources/images/scenegraph-sun-earth-fixed.svg" align="center"></p>
<p>Both the <code class="notranslate" translate="no">sunMesh</code> and the <code class="notranslate" translate="no">earthMesh</code> are children of the <code class="notranslate" translate="no">solarSystem</code>. All 3
are being rotated and now because the <code class="notranslate" translate="no">earthMesh</code> is not a child of the <code class="notranslate" translate="no">sunMesh</code>
it is no longer scaled by 5x.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/scenegraph-sun-earth-orbit-fixed.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/scenegraph-sun-earth-orbit-fixed.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Much better. The earth is smaller than the sun and it's rotating around the sun
and rotating itself.</p>
<p>Continuing that same pattern let's add a moon.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const earthOrbit = new THREE.Object3D();
+earthOrbit.position.x = 10;
+solarSystem.add(earthOrbit);
+objects.push(earthOrbit);

const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
-earthMesh.position.x = 10; // note that this offset is already set in its parent's THREE.Object3D object "earthOrbit"
-solarSystem.add(earthMesh);
+earthOrbit.add(earthMesh);
objects.push(earthMesh);

+const moonOrbit = new THREE.Object3D();
+moonOrbit.position.x = 2;
+earthOrbit.add(moonOrbit);

+const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
+const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
+moonMesh.scale.set(.5, .5, .5);
+moonOrbit.add(moonMesh);
+objects.push(moonMesh);
</pre>
<p>Again we added more invisible scene graph nodes. The first, an <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> called <code class="notranslate" translate="no">earthOrbit</code>
and added both the <code class="notranslate" translate="no">earthMesh</code> and the <code class="notranslate" translate="no">moonOrbit</code> to it, also new. We then added the <code class="notranslate" translate="no">moonMesh</code>
to the <code class="notranslate" translate="no">moonOrbit</code>. The new scene graph looks like this.</p>
<p><img src="../resources/images/scenegraph-sun-earth-moon.svg" align="center"></p>
<p>and here's that</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/scenegraph-sun-earth-moon.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/scenegraph-sun-earth-moon.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>You can see the moon follows the spirograph pattern shown at the top
of this article but we didn't have to manually compute it. We just
setup our scene graph to do it for us.</p>
<p>It is often useful to draw something to visualize the nodes in the scene graph.
Three.js has some helpful ummmm, helpers to ummm, ... help with this.</p>
<p>One is called an <a href="/docs/#api/en/helpers/AxesHelper"><code class="notranslate" translate="no">AxesHelper</code></a>. It draws 3 lines representing the local
<span style="color:red">X</span>,
<span style="color:green">Y</span>, and
<span style="color:blue">Z</span> axes. Let's add one to every node we
created.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// add an AxesHelper to each node
objects.forEach((node) =&gt; {
  const axes = new THREE.AxesHelper();
  axes.material.depthTest = false;
  axes.renderOrder = 1;
  node.add(axes);
});
</pre>
<p>On our case we want the axes to appear even though they are inside the spheres.
To do this we set their material's <code class="notranslate" translate="no">depthTest</code> to false which means they will
not check to see if they are drawing behind something else. We also
set their <code class="notranslate" translate="no">renderOrder</code> to 1 (the default is 0) so that they get drawn after
all the spheres. Otherwise a sphere might draw over them and cover them up.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/scenegraph-sun-earth-moon-axes.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/scenegraph-sun-earth-moon-axes.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>We can see the
<span style="color:red">x (red)</span> and
<span style="color:blue">z (blue)</span> axes. Since we are looking
straight down and each of our objects is only rotating around its
y axis we don't see much of the <span style="color:green">y (green)</span> axes.</p>
<p>It might be hard to see some of them as there are 2 pairs of overlapping axes. Both the <code class="notranslate" translate="no">sunMesh</code>
and the <code class="notranslate" translate="no">solarSystem</code> are at the same position. Similarly the <code class="notranslate" translate="no">earthMesh</code> and
<code class="notranslate" translate="no">earthOrbit</code> are at the same position. Let's add some simple controls to allow us
to turn them on/off for each node.
While we're at it let's also add another helper called the <a href="/docs/#api/en/helpers/GridHelper"><code class="notranslate" translate="no">GridHelper</code></a>. It
makes a 2D grid on the X,Z plane. By default the grid is 10x10 units.</p>
<p>We're also going to use <a href="https://github.com/georgealways/lil-gui">lil-gui</a> which is
a UI library that is very popular with three.js projects. lil-gui takes an
object and a property name on that object and based on the type of the property
automatically makes a UI to manipulate that property.</p>
<p>We want to make both a <a href="/docs/#api/en/helpers/GridHelper"><code class="notranslate" translate="no">GridHelper</code></a> and an <a href="/docs/#api/en/helpers/AxesHelper"><code class="notranslate" translate="no">AxesHelper</code></a> for each node. We need
a label for each node so we'll get rid of the old loop and switch to calling
some function to add the helpers for each node</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-// add an AxesHelper to each node
-objects.forEach((node) =&gt; {
-  const axes = new THREE.AxesHelper();
-  axes.material.depthTest = false;
-  axes.renderOrder = 1;
-  node.add(axes);
-});

+function makeAxisGrid(node, label, units) {
+  const helper = new AxisGridHelper(node, units);
+  gui.add(helper, 'visible').name(label);
+}
+
+makeAxisGrid(solarSystem, 'solarSystem', 25);
+makeAxisGrid(sunMesh, 'sunMesh');
+makeAxisGrid(earthOrbit, 'earthOrbit');
+makeAxisGrid(earthMesh, 'earthMesh');
+makeAxisGrid(moonOrbit, 'moonOrbit');
+makeAxisGrid(moonMesh, 'moonMesh');
</pre>
<p><code class="notranslate" translate="no">makeAxisGrid</code> makes an <code class="notranslate" translate="no">AxisGridHelper</code> which is a class we'll create
to make lil-gui happy. Like it says above lil-gui
will automagically make a UI that manipulates the named property
of some object. It will create a different UI depending on the type
of property. We want it to create a checkbox so we need to specify
a <code class="notranslate" translate="no">bool</code> property. But, we want both the axes and the grid
to appear/disappear based on a single property so we'll make a class
that has a getter and setter for a property. That way we can let lil-gui
think it's manipulating a single property but internally we can set
the visible property of both the <a href="/docs/#api/en/helpers/AxesHelper"><code class="notranslate" translate="no">AxesHelper</code></a> and <a href="/docs/#api/en/helpers/GridHelper"><code class="notranslate" translate="no">GridHelper</code></a> for a node.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// Turns both axes and grid visible on/off
// lil-gui requires a property that returns a bool
// to decide to make a checkbox so we make a setter
// and getter for `visible` which we can tell lil-gui
// to look at.
class AxisGridHelper {
  constructor(node, units = 10) {
    const axes = new THREE.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 2;  // after the grid
    node.add(axes);

    const grid = new THREE.GridHelper(units, units);
    grid.material.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);

    this.grid = grid;
    this.axes = axes;
    this.visible = false;
  }
  get visible() {
    return this._visible;
  }
  set visible(v) {
    this._visible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}
</pre>
<p>One thing to notice is we set the <code class="notranslate" translate="no">renderOrder</code> of the <a href="/docs/#api/en/helpers/AxesHelper"><code class="notranslate" translate="no">AxesHelper</code></a>
to 2 and for the <a href="/docs/#api/en/helpers/GridHelper"><code class="notranslate" translate="no">GridHelper</code></a> to 1 so that the axes get drawn after the grid.
Otherwise the grid might overwrite the axes.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/scenegraph-sun-earth-moon-axes-grids.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/scenegraph-sun-earth-moon-axes-grids.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Turn on the <code class="notranslate" translate="no">solarSystem</code> and you'll see how the earth is exactly 10
units out from the center just like we set above. You can see how the
earth is in the <em>local space</em> of the <code class="notranslate" translate="no">solarSystem</code>. Similarly if you
turn on the <code class="notranslate" translate="no">earthOrbit</code> you'll see how the moon is exactly 2 units
from the center of the <em>local space</em> of the <code class="notranslate" translate="no">earthOrbit</code>.</p>
<p>A few more examples of scene graphs. An automobile in a simple game world might have a scene graph like this</p>
<p><img src="../resources/images/scenegraph-car.svg" align="center"></p>
<p>If you move the car's body all the wheels will move with it. If you wanted the body
to bounce separate from the wheels you might parent the body and the wheels to a "frame" node
that represents the car's frame.</p>
<p>Another example is a human in a game world.</p>
<p><img src="../resources/images/scenegraph-human.svg" align="center"></p>
<p>You can see the scene graph gets pretty complex for a human. In fact
that scene graph above is simplified. For example you might extend it
to cover every finger (at least another 28 nodes) and every toe
(yet another 28 nodes) plus ones for the face and jaw, the eyes and maybe more.</p>
<p>Let's make one semi-complex scene graph. We'll make a tank. The tank will have
6 wheels and a turret. The tank will follow a path. There will be a sphere that
moves around and the tank will target the sphere.</p>
<p>Here's the scene graph. The meshes are colored in green, the <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a>s in blue,
the lights in gold, and the cameras in purple. One camera has not been added
to the scene graph.</p>
<div class="threejs_center"><img src="../resources/images/scenegraph-tank.svg" style="width: 800px;"></div>

<p>Look in the code to see the setup of all of these nodes.</p>
<p>For the target, the thing the tank is aiming at, there is a <code class="notranslate" translate="no">targetOrbit</code>
(<a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a>) which just rotates similar to the <code class="notranslate" translate="no">earthOrbit</code> above. A
<code class="notranslate" translate="no">targetElevation</code> (<a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a>) which is a child of the <code class="notranslate" translate="no">targetOrbit</code> provides an
offset from the <code class="notranslate" translate="no">targetOrbit</code> and a base elevation. Childed to that is another
<a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> called <code class="notranslate" translate="no">targetBob</code> which just bobs up and down relative to the
<code class="notranslate" translate="no">targetElevation</code>. Finally there's the <code class="notranslate" translate="no">targetMesh</code> which is just a cube we
rotate and change its colors</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// move target
targetOrbit.rotation.y = time * .27;
targetBob.position.y = Math.sin(time * 2) * 4;
targetMesh.rotation.x = time * 7;
targetMesh.rotation.y = time * 13;
targetMaterial.emissive.setHSL(time * 10 % 1, 1, .25);
targetMaterial.color.setHSL(time * 10 % 1, 1, .25);
</pre>
<p>For the tank there's an <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> called <code class="notranslate" translate="no">tank</code> which is used to move everything
below it around. The code uses a <a href="/docs/#api/en/extras/curves/SplineCurve"><code class="notranslate" translate="no">SplineCurve</code></a> which it can ask for positions
along that curve. 0.0 is the start of the curve. 1.0 is the end of the curve. It
asks for the current position where it puts the tank. It then asks for a
position slightly further down the curve and uses that to point the tank in that
direction using <a href="/docs/#api/en/core/Object3D.lookAt"><code class="notranslate" translate="no">Object3D.lookAt</code></a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const tankPosition = new THREE.Vector2();
const tankTarget = new THREE.Vector2();

...

// move tank
const tankTime = time * .05;
curve.getPointAt(tankTime % 1, tankPosition);
curve.getPointAt((tankTime + 0.01) % 1, tankTarget);
tank.position.set(tankPosition.x, 0, tankPosition.y);
tank.lookAt(tankTarget.x, 0, tankTarget.y);
</pre>
<p>The turret on top of the tank is moved automatically by being a child
of the tank. To point it at the target we just ask for the target's world position
and then again use <a href="/docs/#api/en/core/Object3D.lookAt"><code class="notranslate" translate="no">Object3D.lookAt</code></a></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const targetPosition = new THREE.Vector3();

...

// face turret at target
targetMesh.getWorldPosition(targetPosition);
turretPivot.lookAt(targetPosition);
</pre>
<p>There's a <code class="notranslate" translate="no">turretCamera</code> which is a child of the <code class="notranslate" translate="no">turretMesh</code> so
it will move up and down and rotate with the turret. We make that
aim at the target.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// make the turretCamera look at target
turretCamera.lookAt(targetPosition);
</pre>
<p>There is also a <code class="notranslate" translate="no">targetCameraPivot</code> which is a child of <code class="notranslate" translate="no">targetBob</code> so it floats
around with the target. We aim that back at the tank. Its purpose is to allow the
<code class="notranslate" translate="no">targetCamera</code> to be offset from the target itself. If we instead made the camera
a child of <code class="notranslate" translate="no">targetBob</code> and just aimed the camera itself it would be inside the
target.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// make the targetCameraPivot look at the tank
tank.getWorldPosition(targetPosition);
targetCameraPivot.lookAt(targetPosition);
</pre>
<p>Finally we rotate all the wheels</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">wheelMeshes.forEach((obj) =&gt; {
  obj.rotation.x = time * 3;
});
</pre>
<p>For the cameras we setup an array of all 4 cameras at init time with descriptions.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const cameras = [
  { cam: camera, desc: 'detached camera', },
  { cam: turretCamera, desc: 'on turret looking at target', },
  { cam: targetCamera, desc: 'near target looking at tank', },
  { cam: tankCamera, desc: 'above back of tank', },
];

const infoElem = document.querySelector('#info');
</pre>
<p>and cycle through our cameras at render time.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const camera = cameras[time * .25 % cameras.length | 0];
infoElem.textContent = camera.desc;
</pre>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/scenegraph-tank.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/scenegraph-tank.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>I hope this gives some idea of how scene graphs work and how you might use them.
Making <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> nodes and parenting things to them is an important step to using
a 3D engine like three.js well. Often it might seem like some complex math is necessary
to make something move and rotate the way you want. For example without a scene graph
computing the motion of the moon or where to put the wheels of the car relative to its
body would be very complicated but using a scene graph it becomes much easier.</p>
<p><a href="materials.html">Next up we'll go over materials</a>.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# setup.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Setup</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Setup">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Setup</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This article is one in a series of articles about three.js.
The first article was <a href="fundamentals.html">about three.js fundamentals</a>.
If you haven't read that yet you might want to start there.</p>
<p>Before we go any further we need to talk about setting up your
computer as a development environment. In particular, for security reasons,
WebGL cannot use images from your hard drive directly. That means
in order to do development you need to use a web server. Fortunately
development web servers are super easy to setup and use.</p>
<p>First off if you'd like you can download this entire site from <a href="https://github.com/gfxfundamentals/threejsfundamentals/archive/gh-pages.zip">this link</a>.
Once downloaded double click the zip file to unpack the files.</p>
<p>Next download one of these simple web servers.</p>
<p>If you'd prefer a web server with a user interface there's
<a href="https://greggman.github.io/servez">Servez</a></p>
<p></p><div class="threejs_image border">
  <img class="" src="../resources/servez.gif">
</div>

<p></p>
<p>Just point it at the folder where you unzipped the files, click "Start", then go to
in your browser <a href="http://localhost:8080/"><code class="notranslate" translate="no">http://localhost:8080/</code></a> or if you'd
like to browse the samples go to <a href="http://localhost:8080/threejs"><code class="notranslate" translate="no">http://localhost:8080/threejs</code></a>.</p>
<p>To stop serving click stop or quit Servez.</p>
<p>If you prefer the command line (I do), another way is to use <a href="https://nodejs.org">node.js</a>.
Download it, install it, then open a command prompt / console / terminal window. If you're on Windows the installer will add a special "Node Command Prompt" so use that.</p>
<p>Then install the <a href="https://github.com/greggman/servez-cli"><code class="notranslate" translate="no">servez</code></a> by typing</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">npm -g install servez
</pre><p>If you're on OSX use</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">sudo npm -g install servez
</pre><p>Once you've done that type</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">servez path/to/folder/where/you/unzipped/files
</pre><p>Or if you're like me</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">cd path/to/folder/where/you/unzipped/files
servez
</pre><p>It should print something like</p>
<p></p><div class="threejs_image ">
  <img class="" src="../resources/servez-response.png">
</div>

<p></p>
<p>Then in your browser go to <a href="http://localhost:8080/"><code class="notranslate" translate="no">http://localhost:8080/</code></a>.</p>
<p>If you don't specify a path then servez will serve the current folder.</p>
<p>If either of those options are not to your liking
<a href="https://stackoverflow.com/questions/12905426/what-is-a-faster-alternative-to-pythons-servez-or-simplehttpserver">there are many other simple servers to choose from</a>.</p>
<p>Now that you have a server setup we can move on to <a href="textures.html">textures</a>.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>


# shadertoy.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Three.js and Shadertoy</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – and Shadertoy">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Three.js and Shadertoy</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p><a href="https://shadertoy.com">Shadertoy</a> is a famous website hosting amazing shader
experiments. People often ask how they can use those shaders with Three.js.</p>
<p>It's important to recognize it's called Shader<strong>TOY</strong> for a reason. In general
shadertoy shaders are not about best practices. Rather they are a fun challenge
similar to say <a href="https://dwitter.net">dwitter</a> (write code in 140 characters) or
<a href="https://js13kgames.com">js13kGames</a> (make a game in 13k or less).</p>
<p>In the case of Shadertoy the puzzle is, <em>write a function that for a given pixel
location outputs a color that draws something interesting</em>. It's a fun challenge
and many of the result are amazing. But, it is not best practice.</p>
<p>Compare <a href="https://www.shadertoy.com/view/XtsSWs">this amazing shadertoy shader that draws an entire city</a></p>
<div class="threejs_center"><img src="../resources/images/shadertoy-skyline.png"></div>

<p>Fullscreen on my GPU it runs at about 5 frames a second. Contrast that to
<a href="https://store.steampowered.com/app/255710/Cities_Skylines/">a game like Cities: Skylines</a></p>
<div class="threejs_center"><img src="../resources/images/cities-skylines.jpg" style="width: 600px;"></div>

<p>This game runs 30-60 frames a second on the same machine because it uses more
traditional techniques, drawing buildings made from triangles with textures on
them, etc...</p>
<p>Still, let's go over using a Shadertoy shader with three.js.</p>
<p>This is the default shadertoy shader if you <a href="https://www.shadertoy.com/new">pick "New" on shadertoy.com</a>, at least as of January 2019.</p>
<pre class="prettyprint showlinemods notranslate lang-glsl" translate="no">// By iq: https://www.shadertoy.com/user/iq
// license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;

    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

    // Output to screen
    fragColor = vec4(col,1.0);
}
</pre>
<p>One thing important to understand about shaders is they are written in a
language called GLSL (Graphics Library Shading Language) designed for 3D math
which includes special types. Above we see <code class="notranslate" translate="no">vec4</code>, <code class="notranslate" translate="no">vec2</code>, <code class="notranslate" translate="no">vec3</code> as 3 such
special types. A <code class="notranslate" translate="no">vec2</code> has 2 values, a <code class="notranslate" translate="no">vec3</code> 3, a <code class="notranslate" translate="no">vec4</code> 4 values. They can be
addressed in a bunch of ways. The most common ways are with <code class="notranslate" translate="no">x</code>, <code class="notranslate" translate="no">y</code>, <code class="notranslate" translate="no">z</code>, and
<code class="notranslate" translate="no">w</code> as in</p>
<pre class="prettyprint showlinemods notranslate lang-glsl" translate="no">vec4 v1 = vec4(1.0, 2.0, 3.0, 4.0);
float v2 = v1.x + v1.y;  // adds 1.0 + 2.0
</pre>
<p>Unlike JavaScript, GLSL is more like C/C++ where variables have to have their
type declared so instead of <code class="notranslate" translate="no">var v = 1.2;</code> it's <code class="notranslate" translate="no">float v = 1.2;</code> declaring <code class="notranslate" translate="no">v</code>
to be a floating point number.</p>
<p>Explaining GLSL in detail is more than we can do in this article. For a quick
overview see <a href="https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html">this article</a>
and maybe follow that up with <a href="https://thebookofshaders.com/">this series</a>.</p>
<p>It should be noted that, at least as of January 2019,
<a href="https://shadertoy.com">shadertoy.com</a> only concerns itself with <em>fragment
shaders</em>. A fragment shader's responsibility is, given a pixel location output
a color for that pixel.</p>
<p>Looking at the function above we can see the shader has an <code class="notranslate" translate="no">out</code> parameter
called <code class="notranslate" translate="no">fragColor</code>. <code class="notranslate" translate="no">out</code> stands for <code class="notranslate" translate="no">output</code>. It's a parameter the function is
expected to provide a value for. We need to set this to some color.</p>
<p>It also has an <code class="notranslate" translate="no">in</code> (for input) parameter called <code class="notranslate" translate="no">fragCoord</code>. This is the pixel
coordinate that is about to be drawn. We can use that coordinate to decide on a
color. If the canvas we're drawing to is 400x300 pixels then the function will
be called 400x300 times or 120,000 times. Each time <code class="notranslate" translate="no">fragCoord</code> will be a
different pixel coordinate.</p>
<p>There are 2 more variables being used that are not defined in the code. One is
<code class="notranslate" translate="no">iResolution</code>. This is set to the resolution of the canvas. If the canvas is
400x300 then <code class="notranslate" translate="no">iResolution</code> would be 400,300 so as the pixel coordinates change
that makes <code class="notranslate" translate="no">uv</code> go from 0.0 to 1.0 across and up the texture. Working with
<em>normalized</em> values often makes things easier and so the majority of shadertoy
shaders start with something like this.</p>
<p>The other undefined variable in the shader is <code class="notranslate" translate="no">iTime</code>. This is the time since
the page loaded in seconds.</p>
<p>In shader jargon these global variables are called <em>uniform</em> variables. They are
called <em>uniform</em> because they don't change, they stay uniform from one iteration
of the shader to the next. It's important to note all of them are specific to
shadertoy. They not <em>official</em> GLSL variables. They are variables the makers of
shadertoy made up.</p>
<p>The <a href="https://www.shadertoy.com/howto">Shadertoy docs define several more</a>. For
now let's write something that handles the two being used in the shader above.</p>
<p>The first thing to do is let's make a single plane that fills the canvas. If you
haven't read it yet we did this in <a href="backgrounds.html">the article on backgrounds</a>
so let's grab that example but remove the cubes. It's pretty short so here's the
entire thing</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
  renderer.autoClearColor = false;

  const camera = new THREE.OrthographicCamera(
    -1, // left
     1, // right
     1, // top
    -1, // bottom
    -1, // near,
     1, // far
  );
  const scene = new THREE.Scene();
  const plane = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicMaterial({
      color: 'red',
  });
  scene.add(new THREE.Mesh(plane, material));

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {
    resizeRendererToDisplaySize(renderer);

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
</pre>
<p>As <a href="backgrounds.html">explained in the backgrounds article</a> an
<a href="/docs/#api/en/cameras/OrthographicCamera"><code class="notranslate" translate="no">OrthographicCamera</code></a> with these parameters and a 2 unit plane will fill the
canvas. For now all we'll get is a red canvas as our plane is using a red
<a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a>.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/shadertoy-prep.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/shadertoy-prep.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Now that we have something working let's add the shadertoy shader. </p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const fragmentShader = `
#include &lt;common&gt;

uniform vec3 iResolution;
uniform float iTime;

// By iq: https://www.shadertoy.com/user/iq
// license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;

    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

    // Output to screen
    fragColor = vec4(col,1.0);
}

void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;
</pre>
<p>Above we declared the 2 uniform variables we talked about. Then we inserted the
shader GLSL code from shadertoy. Finally we called <code class="notranslate" translate="no">mainImage</code> passing it
<code class="notranslate" translate="no">gl_FragColor</code> and <code class="notranslate" translate="no">gl_FragCoord.xy</code>.  <code class="notranslate" translate="no">gl_FragColor</code> is an official WebGL
global variable the shader is responsible for setting to whatever color it wants
the current pixel to be. <code class="notranslate" translate="no">gl_FragCoord</code> is another official WebGL global
variable that tells us the coordinate of the pixel we're currently choosing a
color for.</p>
<p>We then need to setup three.js uniforms so we can supply values to the shader.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const uniforms = {
  iTime: { value: 0 },
  iResolution:  { value: new THREE.Vector3() },
};
</pre>
<p>Each uniform in THREE.js has <code class="notranslate" translate="no">value</code> parameter. That value has to match the type
of the uniform.</p>
<p>Then we pass both the fragment shader and uniforms to a <a href="/docs/#api/en/materials/ShaderMaterial"><code class="notranslate" translate="no">ShaderMaterial</code></a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-const material = new THREE.MeshBasicMaterial({
-    color: 'red',
-});
+const material = new THREE.ShaderMaterial({
+  fragmentShader,
+  uniforms,
+});
</pre>
<p>and before rendering we need to set the values of the uniforms</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-function render() {
+function render(time) {
+  time *= 0.001;  // convert to seconds

  resizeRendererToDisplaySize(renderer);

+  const canvas = renderer.domElement;
+  uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
+  uniforms.iTime.value = time;

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
</pre>
<blockquote>
<p>Note: I have no idea why <code class="notranslate" translate="no">iResolution</code> is a <code class="notranslate" translate="no">vec3</code> and what's in the 3rd value
<a href="https://www.shadertoy.com/howto">is not documented on shadertoy.com</a>. It's
not used above so just setting it to 1 for now. ¯\_(ツ)_/¯</p>
</blockquote>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/shadertoy-basic.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/shadertoy-basic.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>This <a href="https://www.shadertoy.com/new">matches what we see on Shadertoy for a new shader</a>,
at least as of January 2019 😉. What's the shader above doing? </p>
<ul>
<li><code class="notranslate" translate="no">uv</code> goes from 0 to 1. </li>
<li><code class="notranslate" translate="no">cos(uv.xyx)</code> gives us 3 cosine values as a <code class="notranslate" translate="no">vec3</code>. One for <code class="notranslate" translate="no">uv.x</code>, another for <code class="notranslate" translate="no">uv.y</code> and another for <code class="notranslate" translate="no">uv.x</code> again.</li>
<li>Adding in the time, <code class="notranslate" translate="no">cos(iTime+uv.xyx)</code> makes them animate.</li>
<li>Adding in <code class="notranslate" translate="no">vec3(0,2,4)</code> as in <code class="notranslate" translate="no">cos(iTime+uv.xyx+vec3(0,2,4))</code> offsets the cosine waves</li>
<li><code class="notranslate" translate="no">cos</code> goes from -1 to 1 so the <code class="notranslate" translate="no">0.5 * 0.5 + cos(...)</code> converts from -1 &lt;-&gt; 1 to 0.0 &lt;-&gt; 1.0</li>
<li>the results are then used as the RGB color for the current pixel</li>
</ul>
<p>A minor change will make it easier to see the cosine waves. Right now <code class="notranslate" translate="no">uv</code> only
goes from 0 to 1. A cosine repeats at 2π so let's make it go from 0 to 40 by
multiplying by 40.0. That should make it repeat about 6.3 times.</p>
<pre class="prettyprint showlinemods notranslate lang-glsl" translate="no">-vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
+vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx*40.0+vec3(0,2,4));
</pre>
<p>Counting below I see about 6.3 repeats. We can see the blue between the red
since it's offset by 4 via the <code class="notranslate" translate="no">+vec3(0,2,4)</code>. Without that the blue and red
would overlap perfectly making purple.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/shadertoy-basic-x40.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/shadertoy-basic-x40.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Knowing how simple the inputs are and then seeing results like
<a href="https://www.shadertoy.com/view/MdXGW2">a city canal</a>,
<a href="https://www.shadertoy.com/view/4ttSWf">a forest</a>,
<a href="https://www.shadertoy.com/view/ld3Gz2">a snail</a>,
<a href="https://www.shadertoy.com/view/4tBXR1">a mushroom</a>
make the challenge all that much more impressive. Hopefully they also make it
clear why it's not generally the right approach vs the more traditional ways of
making scenes from triangles. The fact that so much math has to be put into
computing the color of every pixel means those examples run very slow.</p>
<p>Some shadertoy shaders take textures as inputs like
<a href="https://www.shadertoy.com/view/MsXSzM">this one</a>. </p>
<pre class="prettyprint showlinemods notranslate lang-glsl" translate="no">// By Daedelus: https://www.shadertoy.com/user/Daedelus
// license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
#define TIMESCALE 0.25
#define TILES 8
#define COLOR 0.7, 1.6, 2.8

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv.x *= iResolution.x / iResolution.y;

    vec4 noise = texture2D(iChannel0, floor(uv * float(TILES)) / float(TILES));
    float p = 1.0 - mod(noise.r + noise.g + noise.b + iTime * float(TIMESCALE), 1.0);
    p = min(max(p * 3.0 - 1.8, 0.1), 2.0);

    vec2 r = mod(uv * float(TILES), 1.0);
    r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
    p *= 1.0 - pow(min(1.0, 12.0 * dot(r, r)), 2.0);

    fragColor = vec4(COLOR, 1.0) * p;
}
</pre>
<p>Passing a texture into a shader is similar to
<a href="textures.html">passing one into a normal material</a> but we need to set
up the texture on the uniforms.</p>
<p>First we'll add the uniform for the texture to the shader. They're referred to
as <code class="notranslate" translate="no">sampler2D</code> in GLSL.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const fragmentShader = `
#include &lt;common&gt;

uniform vec3 iResolution;
uniform float iTime;
+uniform sampler2D iChannel0;

...
</pre>
<p>Then we can load a texture like we covered <a href="textures.html">here</a> and assign the uniform's value.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const loader = new THREE.TextureLoader();
+const texture = loader.load('resources/images/bayer.png');
+texture.minFilter = THREE.NearestFilter;
+texture.magFilter = THREE.NearestFilter;
+texture.wrapS = THREE.RepeatWrapping;
+texture.wrapT = THREE.RepeatWrapping;
const uniforms = {
  iTime: { value: 0 },
  iResolution:  { value: new THREE.Vector3() },
+  iChannel0: { value: texture },
};
</pre>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/shadertoy-bleepy-blocks.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/shadertoy-bleepy-blocks.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>So far we've been using Shadertoy shaders as they are used on
<a href="https://shadertoy.com">Shadertoy.com</a>, namely drawing to cover the canvas.
There's no reason we need to limit it to just that use case though. The
important part to remember is the functions people write on shadertoy generally
just take a <code class="notranslate" translate="no">fragCoord</code> input and a <code class="notranslate" translate="no">iResolution</code>. <code class="notranslate" translate="no">fragCoord</code> does not have to
come from pixel coordinates, we could use something else like texture
coordinates instead and could then use them kind of like other textures. This
technique of using a function to generate textures is often called a
<a href="https://www.google.com/search?q=procedural+texture"><em>procedural texture</em></a>.</p>
<p>Let's change the shader above to do this. The simplest thing to do might be to
take the texture coordinates that three.js normally supplies, multiply them by
<code class="notranslate" translate="no">iResolution</code> and pass that in for <code class="notranslate" translate="no">fragCoords</code>. </p>
<p>To do that we add in a <em>varying</em>. A varying is a value passed from the vertex
shader to the fragment shader that gets interpolated (or varied) between
vertices. To use it in our fragment shader we declare it. Three.js refers to its
texture coordinates as <code class="notranslate" translate="no">uv</code> with the <code class="notranslate" translate="no">v</code> in front meaning <em>varying</em>.</p>
<pre class="prettyprint showlinemods notranslate lang-glsl" translate="no">...

+varying vec2 vUv;

void main() {
-  mainImage(gl_FragColor, gl_FragCoord.xy);
+  mainImage(gl_FragColor, vUv * iResolution.xy);
}
</pre>
<p>Then we need to also provide our own vertex shader. Here is a fairly common
minimal three.js vertex shader. Three.js declares and will provide values for
<code class="notranslate" translate="no">uv</code>, <code class="notranslate" translate="no">projectionMatrix</code>, <code class="notranslate" translate="no">modelViewMatrix</code>, and <code class="notranslate" translate="no">position</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;
</pre>
<p>We need to pass the vertex shader to the <a href="/docs/#api/en/materials/ShaderMaterial"><code class="notranslate" translate="no">ShaderMaterial</code></a></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
});
</pre>
<p>We can set the <code class="notranslate" translate="no">iResolution</code> uniform value at init time since it will no longer change.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const uniforms = {
  iTime: { value: 0 },
-  iResolution:  { value: new THREE.Vector3() },
+  iResolution:  { value: new THREE.Vector3(1, 1, 1) },
  iChannel0: { value: texture },
};
</pre>
<p>and we no longer need to set it at render time</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-const canvas = renderer.domElement;
-uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
uniforms.iTime.value = time;
</pre>
<p>Otherwise I copied back in the original camera and code that sets up 3 rotating
cubes from <a href="responsive.html">the article on responsiveness</a>. The result:</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/shadertoy-as-texture.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/shadertoy-as-texture.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>I hope this at least gets you started on how to use a shadertoy shader with
three.js. Again, it's important to remember that most shadertoy shaders are an
interesting challenge (draw everything with a single function) rather than the
recommended way to actually display things in a performant way. Still, they are
amazing, impressive, beautiful, and you can learn a ton by seeing how they work.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# shadows.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Shadows</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Shadows">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Shadows</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This article is part of a series of articles about three.js. The
first article is <a href="fundamentals.html">three.js fundamentals</a>. If
you haven't read that yet and you're new to three.js you might want to
consider starting there. The
<a href="cameras.html">previous article was about cameras</a> which is
important to have read before you read this article as well as
the <a href="lights.html">article before that one about lights</a>.</p>
<p>Shadows on computers can be a complicated topic. There are various
solutions and all of them have tradeoffs including the solutions
available in three.js.</p>
<p>Three.js by default uses <em>shadow maps</em>. The way a shadow map works
is, <em>for every light that casts shadows all objects marked to cast
shadows are rendered from the point of view of the light</em>. <strong>READ THAT
AGAIN!</strong> and let it sink in.</p>
<p>In other words, if you have 20 objects, and 5 lights, and
all 20 objects are casting shadows and all 5 lights are casting
shadows then your entire scene will be drawn 6 times. All 20 objects
will be drawn for light #1, then all 20 objects will be drawn for
light #2, then #3, etc and finally the actual scene will be drawn
using data from the first 5 renders.</p>
<p>It gets worse, if you have a point light casting shadows the scene
has to be drawn 6 times just for that light!</p>
<p>For these reasons it's common to find other solutions than to have
a bunch of lights all generating shadows. One common solution
is to have multiple lights but only one directional light generating
shadows.</p>
<p>Yet another solution is to use lightmaps and or ambient occlusion maps
to pre-compute the effects of lighting offline. This results in static
lighting or static lighting hints but at least it's fast. We'll
cover both of those in another article.</p>
<p>Another solution is to use fake shadows. Make a plane, put a grayscale
texture in the plane that approximates a shadow,
draw it above the ground below your object.</p>
<p>For example let's use this texture as a fake shadow</p>
<div class="threejs_center"><img src="../examples/resources/images/roundshadow.png"></div>

<p>We'll use some of the code from <a href="cameras.html">the previous article</a>.</p>
<p>Let's set the background color to white.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const scene = new THREE.Scene();
+scene.background = new THREE.Color('white');
</pre>
<p>Then we'll setup the same checkerboard ground but this time it's using
a <a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a> as we don't need lighting for the ground.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const loader = new THREE.TextureLoader();

{
  const planeSize = 40;

-  const loader = new THREE.TextureLoader();
  const texture = loader.load('resources/images/checker.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  const repeats = planeSize / 2;
  texture.repeat.set(repeats, repeats);

  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
+  planeMat.color.setRGB(1.5, 1.5, 1.5);
  const mesh = new THREE.Mesh(planeGeo, planeMat);
  mesh.rotation.x = Math.PI * -.5;
  scene.add(mesh);
}
</pre>
<p>Note we're setting the color to <code class="notranslate" translate="no">1.5, 1.5, 1.5</code>. This will multiply the checkerboard
texture's colors by 1.5, 1.5, 1.5. Since the texture's colors are 0x808080 and 0xC0C0C0
which is medium gray and light gray, multiplying them by 1.5 will give us a white and
light grey checkerboard.</p>
<p>Let's load the shadow texture</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const shadowTexture = loader.load('resources/images/roundshadow.png');
</pre>
<p>and make an array to remember each sphere and associated objects.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const sphereShadowBases = [];
</pre>
<p>Then we'll make a sphere geometry</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const sphereRadius = 1;
const sphereWidthDivisions = 32;
const sphereHeightDivisions = 16;
const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
</pre>
<p>And a plane geometry for the fake shadow</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const planeSize = 1;
const shadowGeo = new THREE.PlaneGeometry(planeSize, planeSize);
</pre>
<p>Now we'll make a bunch of spheres. For each sphere we'll create a <code class="notranslate" translate="no">base</code>
<a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">THREE.Object3D</code></a> and we'll make both the shadow plane mesh and the sphere mesh
children of the base. That way if we move the base both the sphere and the shadow
will move. We need to put the shadow slightly above the ground to prevent z-fighting.
We also set <code class="notranslate" translate="no">depthWrite</code> to false so that the shadows don't mess each other up.
We'll go over both of these issues in <a href="transparency.html">another article</a>.
The shadow is a <a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a> because it doesn't need lighting.</p>
<p>We make each sphere a different hue and then save off the base, the sphere mesh,
the shadow mesh and the initial y position of each sphere.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const numSpheres = 15;
for (let i = 0; i &lt; numSpheres; ++i) {
  // make a base for the shadow and the sphere
  // so they move together.
  const base = new THREE.Object3D();
  scene.add(base);

  // add the shadow to the base
  // note: we make a new material for each sphere
  // so we can set that sphere's material transparency
  // separately.
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,    // so we can see the ground
    depthWrite: false,    // so we don't have to sort
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.position.y = 0.001;  // so we're above the ground slightly
  shadowMesh.rotation.x = Math.PI * -.5;
  const shadowSize = sphereRadius * 4;
  shadowMesh.scale.set(shadowSize, shadowSize, shadowSize);
  base.add(shadowMesh);

  // add the sphere to the base
  const u = i / numSpheres;   // goes from 0 to 1 as we iterate the spheres.
  const sphereMat = new THREE.MeshPhongMaterial();
  sphereMat.color.setHSL(u, 1, .75);
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  sphereMesh.position.set(0, sphereRadius + 2, 0);
  base.add(sphereMesh);

  // remember all 3 plus the y position
  sphereShadowBases.push({base, sphereMesh, shadowMesh, y: sphereMesh.position.y});
}
</pre>
<p>We setup 2 lights. One is a <a href="/docs/#api/en/lights/HemisphereLight"><code class="notranslate" translate="no">HemisphereLight</code></a> with the intensity set to 2 to really
brighten things up.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const skyColor = 0xB1E1FF;  // light blue
  const groundColor = 0xB97A20;  // brownish orange
  const intensity = 2;
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  scene.add(light);
}
</pre>
<p>The other is a <a href="/docs/#api/en/lights/DirectionalLight"><code class="notranslate" translate="no">DirectionalLight</code></a> so the spheres get some definition</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(0, 10, 5);
  light.target.position.set(-5, 0, 0);
  scene.add(light);
  scene.add(light.target);
}
</pre>
<p>It would render as is but let's animate there spheres.
For each sphere, shadow, base set we move the base in the xz plane, we
move the sphere up and down using <a href="/docs/#api/en/math/Math.abs(Math.sin(time))"><code class="notranslate" translate="no">Math.abs(Math.sin(time))</code></a>
which gives us a bouncy animation. And, we also set the shadow material's
opacity so that as each sphere goes higher its shadow fades out.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {
  time *= 0.001;  // convert to seconds

  ...

  sphereShadowBases.forEach((sphereShadowBase, ndx) =&gt; {
    const {base, sphereMesh, shadowMesh, y} = sphereShadowBase;

    // u is a value that goes from 0 to 1 as we iterate the spheres
    const u = ndx / sphereShadowBases.length;

    // compute a position for the base. This will move
    // both the sphere and its shadow
    const speed = time * .2;
    const angle = speed + u * Math.PI * 2 * (ndx % 1 ? 1 : -1);
    const radius = Math.sin(speed - ndx) * 10;
    base.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);

    // yOff is a value that goes from 0 to 1
    const yOff = Math.abs(Math.sin(time * 2 + ndx));
    // move the sphere up and down
    sphereMesh.position.y = y + THREE.MathUtils.lerp(-2, 2, yOff);
    // fade the shadow as the sphere goes up
    shadowMesh.material.opacity = THREE.MathUtils.lerp(1, .25, yOff);
  });

  ...
</pre>
<p>And here's 15 kind of bouncing balls.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/shadows-fake.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/shadows-fake.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>In some apps it's common to use a round or oval shadow for everything but
of course you could also use different shaped shadow textures. You might also
give the shadow a harder edge. A good example of using this type
of shadow is <a href="https://www.google.com/search?tbm=isch&amp;q=animal+crossing+pocket+camp+screenshots">Animal Crossing Pocket Camp</a>
where you can see each character has a simple round shadow. It's effective and cheap.
<a href="https://www.google.com/search?q=monument+valley+screenshots&amp;tbm=isch">Monument Valley</a>
appears to also use this kind of shadow for the main character.</p>
<p>So, moving on to shadow maps, there are 3 lights which can cast shadows. The <a href="/docs/#api/en/lights/DirectionalLight"><code class="notranslate" translate="no">DirectionalLight</code></a>,
the <a href="/docs/#api/en/lights/PointLight"><code class="notranslate" translate="no">PointLight</code></a>, and the <a href="/docs/#api/en/lights/SpotLight"><code class="notranslate" translate="no">SpotLight</code></a>.</p>
<p>Let's start with the <a href="/docs/#api/en/lights/DirectionalLight"><code class="notranslate" translate="no">DirectionalLight</code></a> with the helper example from <a href="lights.html">the lights article</a>.</p>
<p>The first thing we need to do is turn on shadows in the renderer.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
+renderer.shadowMap.enabled = true;
</pre>
<p>Then we also need to tell the light to cast a shadow</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const light = new THREE.DirectionalLight(color, intensity);
+light.castShadow = true;
</pre>
<p>We also need to go to each mesh in the scene and decide if it should
both cast shadows and/or receive shadows.</p>
<p>Let's make the plane (the ground) only receive shadows since we don't
really care what happens underneath.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.receiveShadow = true;
</pre>
<p>For the cube and the sphere let's have them both receive and cast shadows</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const mesh = new THREE.Mesh(cubeGeo, cubeMat);
mesh.castShadow = true;
mesh.receiveShadow = true;

...

const mesh = new THREE.Mesh(sphereGeo, sphereMat);
mesh.castShadow = true;
mesh.receiveShadow = true;
</pre>
<p>And then we run it.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/shadows-directional-light.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/shadows-directional-light.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>What happened? Why are parts of the shadows missing?</p>
<p>The reason is shadow maps are created by rendering the scene from the point
of view of the light. In this case there is a camera at the <a href="/docs/#api/en/lights/DirectionalLight"><code class="notranslate" translate="no">DirectionalLight</code></a>
that is looking at its target. Just like <a href="cameras.html">the camera's we previously covered</a>
the light's shadow camera defines an area inside of which
the shadows get rendered. In the example above that area is too small.</p>
<p>In order to visualize that area we can get the light's shadow camera and add
a <a href="/docs/#api/en/helpers/CameraHelper"><code class="notranslate" translate="no">CameraHelper</code></a> to the scene.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
scene.add(cameraHelper);
</pre>
<p>And now you can see the area for which shadows are cast and received.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/shadows-directional-light-with-camera-helper.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/shadows-directional-light-with-camera-helper.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Adjust the target x value back and forth and it should be pretty clear that only
what's inside the light's shadow camera box is where shadows are drawn.</p>
<p>We can adjust the size of that box by adjusting the light's shadow camera.</p>
<p>Let's add some GUI setting to adjust the light's shadow camera box. Since a
<a href="/docs/#api/en/lights/DirectionalLight"><code class="notranslate" translate="no">DirectionalLight</code></a> represents light all going in a parallel direction, the
<a href="/docs/#api/en/lights/DirectionalLight"><code class="notranslate" translate="no">DirectionalLight</code></a> uses an <a href="/docs/#api/en/cameras/OrthographicCamera"><code class="notranslate" translate="no">OrthographicCamera</code></a> for its shadow camera.
We went over how an <a href="/docs/#api/en/cameras/OrthographicCamera"><code class="notranslate" translate="no">OrthographicCamera</code></a> works in <a href="cameras.html">the previous article about cameras</a>.</p>
<p>Recall an <a href="/docs/#api/en/cameras/OrthographicCamera"><code class="notranslate" translate="no">OrthographicCamera</code></a> defines
its box or <em>view frustum</em> by its <code class="notranslate" translate="no">left</code>, <code class="notranslate" translate="no">right</code>, <code class="notranslate" translate="no">top</code>, <code class="notranslate" translate="no">bottom</code>, <code class="notranslate" translate="no">near</code>, <code class="notranslate" translate="no">far</code>,
and <code class="notranslate" translate="no">zoom</code> properties.</p>
<p>Again let's make a helper class for the lil-gui. We'll make a <code class="notranslate" translate="no">DimensionGUIHelper</code>
that we'll pass an object and 2 properties. It will present one property that lil-gui
can adjust and in response will set the two properties one positive and one negative.
We can use this to set <code class="notranslate" translate="no">left</code> and <code class="notranslate" translate="no">right</code> as <code class="notranslate" translate="no">width</code> and <code class="notranslate" translate="no">up</code> and <code class="notranslate" translate="no">down</code> as <code class="notranslate" translate="no">height</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class DimensionGUIHelper {
  constructor(obj, minProp, maxProp) {
    this.obj = obj;
    this.minProp = minProp;
    this.maxProp = maxProp;
  }
  get value() {
    return this.obj[this.maxProp] * 2;
  }
  set value(v) {
    this.obj[this.maxProp] = v /  2;
    this.obj[this.minProp] = v / -2;
  }
}
</pre>
<p>We'll also use the <code class="notranslate" translate="no">MinMaxGUIHelper</code> we created in the <a href="cameras.html">camera article</a>
to adjust <code class="notranslate" translate="no">near</code> and <code class="notranslate" translate="no">far</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const gui = new GUI();
gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
gui.add(light, 'intensity', 0, 2, 0.01);
+{
+  const folder = gui.addFolder('Shadow Camera');
+  folder.open();
+  folder.add(new DimensionGUIHelper(light.shadow.camera, 'left', 'right'), 'value', 1, 100)
+    .name('width')
+    .onChange(updateCamera);
+  folder.add(new DimensionGUIHelper(light.shadow.camera, 'bottom', 'top'), 'value', 1, 100)
+    .name('height')
+    .onChange(updateCamera);
+  const minMaxGUIHelper = new MinMaxGUIHelper(light.shadow.camera, 'near', 'far', 0.1);
+  folder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
+  folder.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);
+  folder.add(light.shadow.camera, 'zoom', 0.01, 1.5, 0.01).onChange(updateCamera);
+}
</pre>
<p>We tell the GUI to call our <code class="notranslate" translate="no">updateCamera</code> function anytime anything changes.
Let's write that function to update the light, the helper for the light, the
light's shadow camera, and the helper showing the light's shadow camera.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function updateCamera() {
  // update the light target's matrixWorld because it's needed by the helper
  light.target.updateMatrixWorld();
  helper.update();
  // update the light's shadow camera's projection matrix
  light.shadow.camera.updateProjectionMatrix();
  // and now update the camera helper we're using to show the light's shadow camera
  cameraHelper.update();
}
updateCamera();
</pre>
<p>And now that we've given the light's shadow camera a GUI we can play with the values.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/shadows-directional-light-with-camera-gui.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/shadows-directional-light-with-camera-gui.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Set the <code class="notranslate" translate="no">width</code> and <code class="notranslate" translate="no">height</code> to about 30 and you can see the shadows are correct
and the areas that need to be in shadow for this scene are entirely covered.</p>
<p>But this brings up the question, why not just set <code class="notranslate" translate="no">width</code> and <code class="notranslate" translate="no">height</code> to some
giant numbers to just cover everything? Set the <code class="notranslate" translate="no">width</code> and <code class="notranslate" translate="no">height</code> to 100
and you might see something like this</p>
<div class="threejs_center"><img src="../resources/images/low-res-shadow-map.png" style="width: 369px"></div>

<p>What's going on with these low-res shadows?!</p>
<p>This issue is yet another shadow related setting to be aware of.
Shadow maps are textures the shadows get drawn into.
Those textures have a size. The shadow camera's area we set above is stretched
across that size. That means the larger area you set, the more blocky your shadows will
be.</p>
<p>You can set the resolution of the shadow map's texture by setting <code class="notranslate" translate="no">light.shadow.mapSize.width</code>
and <code class="notranslate" translate="no">light.shadow.mapSize.height</code>. They default to 512x512.
The larger you make them the more memory they take and the slower they are to compute so you want
to set them as small as you can and still make your scene work. The same is true with the
light's shadow camera area. Smaller means better looking shadows so make the area as small as you
can and still cover your scene. Be aware that each user's machine has a maximum texture size
allowed which is available on the renderer as <a href="/docs/#api/en/renderers/WebGLRenderer#capabilities"><code class="notranslate" translate="no">renderer.capabilities.maxTextureSize</code></a>.</p>
<!--
Ok but what about `near` and `far` I hear you thinking. Can we set `near` to 0.00001 and far to `100000000`
-->
<p>Switching to the <a href="/docs/#api/en/lights/SpotLight"><code class="notranslate" translate="no">SpotLight</code></a> the light's shadow camera becomes a <a href="/docs/#api/en/cameras/PerspectiveCamera"><code class="notranslate" translate="no">PerspectiveCamera</code></a>. Unlike the <a href="/docs/#api/en/lights/DirectionalLight"><code class="notranslate" translate="no">DirectionalLight</code></a>'s shadow camera
where we could manually set most its settings, <a href="/docs/#api/en/lights/SpotLight"><code class="notranslate" translate="no">SpotLight</code></a>'s shadow camera is controlled by the <a href="/docs/#api/en/lights/SpotLight"><code class="notranslate" translate="no">SpotLight</code></a> itself. The <code class="notranslate" translate="no">fov</code> for the shadow
camera is directly connected to the <a href="/docs/#api/en/lights/SpotLight"><code class="notranslate" translate="no">SpotLight</code></a>'s <code class="notranslate" translate="no">angle</code> setting.
The <code class="notranslate" translate="no">aspect</code> is set automatically based on the size of the shadow map.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-const light = new THREE.DirectionalLight(color, intensity);
+const light = new THREE.SpotLight(color, intensity);
</pre>
<p>and we added back in the <code class="notranslate" translate="no">penumbra</code> and <code class="notranslate" translate="no">angle</code> settings
from our <a href="lights.html">article about lights</a>.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/shadows-spot-light-with-camera-gui.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/shadows-spot-light-with-camera-gui.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<!--
You can notice, just like the last example if we set the angle high
then the shadow map, the texture is spread over a very large area and
the resolution of our shadows gets really low.

div class="threejs_center"><img src="../resources/images/low-res-shadow-map-spotlight.png" style="width: 344px"></div>

You can increase the size of the shadow map as mentioned above. You can
also blur the result

<div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/shadows-spot-light-with-shadow-radius"></iframe></div>
  <a class="threejs_center" href="/manual/examples/shadows-spot-light-with-shadow-radius" target="_blank">click here to open in a separate window</a>
</div>


-->
<p>And finally there's shadows with a <a href="/docs/#api/en/lights/PointLight"><code class="notranslate" translate="no">PointLight</code></a>. Since a <a href="/docs/#api/en/lights/PointLight"><code class="notranslate" translate="no">PointLight</code></a>
shines in all directions the only relevant settings are <code class="notranslate" translate="no">near</code> and <code class="notranslate" translate="no">far</code>.
Otherwise the <a href="/docs/#api/en/lights/PointLight"><code class="notranslate" translate="no">PointLight</code></a> shadow is effectively 6 <a href="/docs/#api/en/lights/SpotLight"><code class="notranslate" translate="no">SpotLight</code></a> shadows
each one pointing to the face of a cube around the light. This means
<a href="/docs/#api/en/lights/PointLight"><code class="notranslate" translate="no">PointLight</code></a> shadows are much slower since the entire scene must be
drawn 6 times, one for each direction.</p>
<p>Let's put a box around our scene so we can see shadows on the walls
and ceiling. We'll set the material's <code class="notranslate" translate="no">side</code> property to <code class="notranslate" translate="no">THREE.BackSide</code>
so we render the inside of the box instead of the outside. Like the floor
we'll set it only to receive shadows. Also we'll set the position of the
box so its bottom is slightly below the floor so the floor and the bottom
of the box don't z-fight.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">{
  const cubeSize = 30;
  const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cubeMat = new THREE.MeshPhongMaterial({
    color: '#CCC',
    side: THREE.BackSide,
  });
  const mesh = new THREE.Mesh(cubeGeo, cubeMat);
  mesh.receiveShadow = true;
  mesh.position.set(0, cubeSize / 2 - 0.1, 0);
  scene.add(mesh);
}
</pre>
<p>And of course we need to switch the light to a <a href="/docs/#api/en/lights/PointLight"><code class="notranslate" translate="no">PointLight</code></a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-const light = new THREE.SpotLight(color, intensity);
+const light = new THREE.PointLight(color, intensity);

....

// so we can easily see where the point light is
+const helper = new THREE.PointLightHelper(light);
+scene.add(helper);
</pre>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/shadows-point-light.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/shadows-point-light.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Use the <code class="notranslate" translate="no">position</code> GUI settings to move the light around
and you'll see the shadows fall on all the walls. You can
also adjust <code class="notranslate" translate="no">near</code> and <code class="notranslate" translate="no">far</code> settings and see just like
the other shadows when things are closer than <code class="notranslate" translate="no">near</code> they
no longer receive a shadow and they are further than <code class="notranslate" translate="no">far</code>
they are always in shadow.</p>
<!--
self shadow, shadow acne
-->

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# textures.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Textures</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Textures">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Textures</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This article is one in a series of articles about three.js.
The first article was <a href="fundamentals.html">about three.js fundamentals</a>.
The <a href="setup.html">previous article</a> was about setting up for this article.
If you haven't read that yet you might want to start there.</p>
<p>Textures are a kind of large topic in Three.js and
I'm not 100% sure at what level to explain them but I will try.
There are many topics and many of them interrelate so it's hard to explain
them all at once. Here's quick table of contents for this article.</p>
<ul>
<li><a href="#hello">Hello Texture</a></li>
<li><a href="#six">6 textures, a different one on each face of a cube</a></li>
<li><a href="#loading">Loading textures</a></li>
<ul>
  <li><a href="#easy">The easy way</a></li>
  <li><a href="#wait1">Waiting for a texture to load</a></li>
  <li><a href="#waitmany">Waiting for multiple textures to load</a></li>
  <li><a href="#cors">Loading textures from other origins</a></li>
</ul>
<li><a href="#memory">Memory usage</a></li>
<li><a href="#format">JPG vs PNG</a></li>
<li><a href="#filtering-and-mips">Filtering and mips</a></li>
<li><a href="#uvmanipulation">Repeating, offseting, rotating, wrapping</a></li>
</ul>

<h2 id="-a-name-hello-a-hello-texture"><a name="hello"></a> Hello Texture</h2>
<p>Textures are <em>generally</em> images that are most often created
in some 3rd party program like Photoshop or GIMP. For example let's
put this image on cube.</p>
<div class="threejs_center">
  <img src="../examples/resources/images/wall.jpg" style="width: 600px;" class="border">
</div>

<p>We'll modify one of our first samples. All we need to do is create a <a href="/docs/#api/en/loaders/TextureLoader"><code class="notranslate" translate="no">TextureLoader</code></a>. Call its
<a href="/docs/#api/en/loaders/TextureLoader#load"><code class="notranslate" translate="no">load</code></a> method with the URL of an
image and set the material's <code class="notranslate" translate="no">map</code> property to the result instead of setting its <code class="notranslate" translate="no">color</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const loader = new THREE.TextureLoader();
+const texture = loader.load( 'resources/images/wall.jpg' );
+texture.colorSpace = THREE.SRGBColorSpace;

const material = new THREE.MeshBasicMaterial({
-  color: 0xFF8844,
+  map: texture,
});
</pre>
<p>Note that we're using <a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a> so no need for any lights.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/textured-cube.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/textured-cube.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<h2 id="-a-name-six-a-6-textures-a-different-one-on-each-face-of-a-cube"><a name="six"></a> 6 Textures, a different one on each face of a cube</h2>
<p>How about 6 textures, one on each face of a cube?</p>
<div class="threejs_center">
  <div>
    <img src="../examples/resources/images/flower-1.jpg" style="width: 100px;" class="border">
    <img src="../examples/resources/images/flower-2.jpg" style="width: 100px;" class="border">
    <img src="../examples/resources/images/flower-3.jpg" style="width: 100px;" class="border">
  </div>
  <div>
    <img src="../examples/resources/images/flower-4.jpg" style="width: 100px;" class="border">
    <img src="../examples/resources/images/flower-5.jpg" style="width: 100px;" class="border">
    <img src="../examples/resources/images/flower-6.jpg" style="width: 100px;" class="border">
  </div>
</div>

<p>We just make 6 materials and pass them as an array when we create the <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const loader = new THREE.TextureLoader();
-const texture = loader.load( 'resources/images/wall.jpg' );
-texture.colorSpace = THREE.SRGBColorSpace;

-const material = new THREE.MeshBasicMaterial({
-  map: texture,
-});
+const materials = [
+  new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/flower-1.jpg')}),
+  new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/flower-2.jpg')}),
+  new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/flower-3.jpg')}),
+  new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/flower-4.jpg')}),
+  new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/flower-5.jpg')}),
+  new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/flower-6.jpg')}),
+];
-const cube = new THREE.Mesh(geometry, material);
+const cube = new THREE.Mesh(geometry, materials);

+function loadColorTexture( path ) {
+  const texture = loader.load( path );
+  texture.colorSpace = THREE.SRGBColorSpace;
+  return texture;
+}
</pre>
<p>It works!</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/textured-cube-6-textures.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/textured-cube-6-textures.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>It should be noted though that not all geometry types supports multiple
materials. <a href="/docs/#api/en/geometries/BoxGeometry"><code class="notranslate" translate="no">BoxGeometry</code></a> can use 6 materials one for each face.
<a href="/docs/#api/en/geometries/ConeGeometry"><code class="notranslate" translate="no">ConeGeometry</code></a> can use 2 materials, one for the bottom and one for the cone.
<a href="/docs/#api/en/geometries/CylinderGeometry"><code class="notranslate" translate="no">CylinderGeometry</code></a> can use 3 materials, bottom, top, and side.
For other cases you will need to build or load custom geometry and/or modify texture coordinates.</p>
<p>It's far more common in other 3D engines and far more performant to use a
<a href="https://en.wikipedia.org/wiki/Texture_atlas">Texture Atlas</a>
if you want to allow multiple images on a single geometry. A Texture atlas
is where you put multiple images in a single texture and then use texture coordinates
on the vertices of your geometry to select which parts of a texture are used on
each triangle in your geometry.</p>
<p>What are texture coordinates? They are data added to each vertex of a piece of geometry
that specify what part of the texture corresponds to that specific vertex.
We'll go over them when we start <a href="custom-buffergeometry.html">building custom geometry</a>.</p>
<h2 id="-a-name-loading-a-loading-textures"><a name="loading"></a> Loading Textures</h2>
<h3 id="-a-name-easy-a-the-easy-way"><a name="easy"></a> The Easy Way</h3>
<p>Most of the code on this site uses the easiest method of loading textures.
We create a <a href="/docs/#api/en/loaders/TextureLoader"><code class="notranslate" translate="no">TextureLoader</code></a> and then call its <a href="/docs/#api/en/loaders/TextureLoader#load"><code class="notranslate" translate="no">load</code></a> method.
This returns a <a href="/docs/#api/en/textures/Texture"><code class="notranslate" translate="no">Texture</code></a> object.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const texture = loader.load('resources/images/flower-1.jpg');
</pre>
<p>It's important to note that using this method our texture will be transparent until
the image is loaded asynchronously by three.js at which point it will update the texture
with the downloaded image.</p>
<p>This has the big advantage that we don't have to wait for the texture to load and our
page will start rendering immediately. That's probably okay for a great many use cases
but if we want we can ask three.js to tell us when the texture has finished downloading.</p>
<h3 id="-a-name-wait1-a-waiting-for-a-texture-to-load"><a name="wait1"></a> Waiting for a texture to load</h3>
<p>To wait for a texture to load the <code class="notranslate" translate="no">load</code> method of the texture loader takes a callback
that will be called when the texture has finished loading. Going back to our top example
we can wait for the texture to load before creating our <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> and adding it to scene
like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const loader = new THREE.TextureLoader();
loader.load('resources/images/wall.jpg', (texture) =&gt; {
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cubes.push(cube);  // add to our list of cubes to rotate
});
</pre>
<p>Unless you clear your browser's cache and have a slow connection you're unlikely
to see the any difference but rest assured it is waiting for the texture to load.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/textured-cube-wait-for-texture.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/textured-cube-wait-for-texture.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<h3 id="-a-name-waitmany-a-waiting-for-multiple-textures-to-load"><a name="waitmany"></a> Waiting for multiple textures to load</h3>
<p>To wait until all textures have loaded you can use a <a href="/docs/#api/en/loaders/managers/LoadingManager"><code class="notranslate" translate="no">LoadingManager</code></a>. Create one
and pass it to the <a href="/docs/#api/en/loaders/TextureLoader"><code class="notranslate" translate="no">TextureLoader</code></a> then set its  <a href="/docs/#api/en/loaders/managers/LoadingManager#onLoad"><code class="notranslate" translate="no">onLoad</code></a>
property to a callback.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const loadManager = new THREE.LoadingManager();
*const loader = new THREE.TextureLoader(loadManager);

const materials = [
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-1.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-2.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-3.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-4.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-5.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-6.jpg')}),
];

+loadManager.onLoad = () =&gt; {
+  const cube = new THREE.Mesh(geometry, materials);
+  scene.add(cube);
+  cubes.push(cube);  // add to our list of cubes to rotate
+};
</pre>
<p>The <a href="/docs/#api/en/loaders/managers/LoadingManager"><code class="notranslate" translate="no">LoadingManager</code></a> also has an <a href="/docs/#api/en/loaders/managers/LoadingManager#onProgress"><code class="notranslate" translate="no">onProgress</code></a> property
we can set to another callback to show a progress indicator.</p>
<p>First we'll add a progress bar in HTML</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;body&gt;
  &lt;canvas id="c"&gt;&lt;/canvas&gt;
+  &lt;div id="loading"&gt;
+    &lt;div class="progress"&gt;&lt;div class="progressbar"&gt;&lt;/div&gt;&lt;/div&gt;
+  &lt;/div&gt;
&lt;/body&gt;
</pre>
<p>and the CSS for it</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">#loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
#loading .progress {
    margin: 1.5em;
    border: 1px solid white;
    width: 50vw;
}
#loading .progressbar {
    margin: 2px;
    background: white;
    height: 1em;
    transform-origin: top left;
    transform: scaleX(0);
}
</pre>
<p>Then in the code we'll update the scale of the <code class="notranslate" translate="no">progressbar</code> in our <code class="notranslate" translate="no">onProgress</code> callback. It gets
called with the URL of the last item loaded, the number of items loaded so far, and the total
number of items loaded.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const loadingElem = document.querySelector('#loading');
+const progressBarElem = loadingElem.querySelector('.progressbar');

loadManager.onLoad = () =&gt; {
+  loadingElem.style.display = 'none';
  const cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);
  cubes.push(cube);  // add to our list of cubes to rotate
};

+loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) =&gt; {
+  const progress = itemsLoaded / itemsTotal;
+  progressBarElem.style.transform = `scaleX(${progress})`;
+};
</pre>
<p>Unless you clear your cache and have a slow connection you might not see
the loading bar.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/textured-cube-wait-for-all-textures.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/textured-cube-wait-for-all-textures.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<h2 id="-a-name-cors-a-loading-textures-from-other-origins"><a name="cors"></a> Loading textures from other origins</h2>
<p>To use images from other servers those servers need to send the correct headers.
If they don't you cannot use the images in three.js and will get an error.
If you run the server providing the images make sure it
<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">sends the correct headers</a>.
If you don't control the server hosting the images and it does not send the
permission headers then you can't use the images from that server.</p>
<p>For example <a href="https://imgur.com">imgur</a>, <a href="https://flickr.com">flickr</a>, and
<a href="https://github.com">github</a> all send headers allowing you to use images
hosted on their servers in three.js. Most other websites do not.</p>
<h2 id="-a-name-memory-a-memory-usage"><a name="memory"></a> Memory Usage</h2>
<p>Textures are often the part of a three.js app that use the most memory. It's important to understand
that <em>in general</em>, textures take <code class="notranslate" translate="no">width * height * 4 * 1.33</code> bytes of memory.</p>
<p>Notice that says nothing about compression. I can make a .jpg image and set its compression super
high. For example let's say I was making a scene of a house. Inside the house there is a table
and I decide to put this wood texture on the top surface of the table</p>
<div class="threejs_center"><img class="border" src="../resources/images/compressed-but-large-wood-texture.jpg" align="center" style="width: 300px"></div>

<p>That image is only 157k so it will download relatively quickly but <a href="resources/images/compressed-but-large-wood-texture.jpg">it is actually
3024 x 3761 pixels in size</a>.
Following the equation above that's</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">3024 * 3761 * 4 * 1.33 = 60505764.5
</pre><p>That image will take <strong>60 MEG OF MEMORY!</strong> in three.js.
A few textures like that and you'll be out of memory.</p>
<p>I bring this up because it's important to know that using textures has a hidden cost.
In order for three.js to use the texture it has to hand it off to the GPU and the
GPU <em>in general</em> requires the texture data to be uncompressed.</p>
<p>The moral of the story is make your textures small in dimensions not just small
in file size. Small in file size = fast to download. Small in dimensions = takes
less memory. How small should you make them?
As small as you can and still look as good as you need them to look.</p>
<h2 id="-a-name-format-a-jpg-vs-png"><a name="format"></a> JPG vs PNG</h2>
<p>This is pretty much the same as regular HTML in that JPGs have lossy compression,
PNGs have lossless compression so PNGs are generally slower to download.
But, PNGs support transparency. PNGs are also probably the appropriate format
for non-image data like normal maps, and other kinds of non-image maps which we'll go over later.</p>
<p>It's important to remember that a JPG doesn't use
less memory than a PNG in WebGL. See above.</p>
<h2 id="-a-name-filtering-and-mips-a-filtering-and-mips"><a name="filtering-and-mips"></a> Filtering and Mips</h2>
<p>Let's apply this 16x16 texture</p>
<div class="threejs_center"><img src="../resources/images/mip-low-res-enlarged.png" class="nobg" align="center"></div>

<p>To a cube</p>
<div class="spread"><div data-diagram="filterCube"></div></div>

<p>Let's draw that cube really small</p>
<div class="spread"><div data-diagram="filterCubeSmall"></div></div>

<p>Hmmm, I guess that's hard to see. Let's magnify that tiny cube</p>
<div class="spread"><div data-diagram="filterCubeSmallLowRes"></div></div>

<p>How does the GPU know which colors to make each pixel it's drawing for the tiny cube?
What if the cube was so small that it's just 1 or 2 pixels?</p>
<p>This is what filtering is about.</p>
<p>If it was Photoshop, Photoshop would average nearly all the pixels together to figure out what color
to make those 1 or 2 pixels. That would be a very slow operation. GPUs solve this issue
using mipmaps.</p>
<p>Mips are copies of the texture, each one half as wide and half as tall as the previous
mip where the pixels have been blended to make the next smaller mip. Mips are created
until we get all the way to a 1x1 pixel mip. For the image above all of the mips would
end up being something like this</p>
<div class="threejs_center"><img src="../resources/images/mipmap-low-res-enlarged.png" class="nobg" align="center"></div>

<p>Now, when the cube is drawn so small that it's only 1 or 2 pixels large the GPU can choose
to use just the smallest or next to smallest mip level to decide what color to make the
tiny cube.</p>
<p>In three.js you can choose what happens both when the texture is drawn
larger than its original size and what happens when it's drawn smaller than its
original size.</p>
<p>For setting the filter when the texture is drawn larger than its original size
you set <a href="/docs/#api/en/textures/Texture#magFilter"><code class="notranslate" translate="no">texture.magFilter</code></a> property to either <code class="notranslate" translate="no">THREE.NearestFilter</code> or
 <code class="notranslate" translate="no">THREE.LinearFilter</code>.  <code class="notranslate" translate="no">NearestFilter</code> means
just pick the closet single pixel from the original texture. With a low
resolution texture this gives you a very pixelated look like Minecraft.</p>
<p><code class="notranslate" translate="no">LinearFilter</code> means choose the 4 pixels from the texture that are closest
to the where we should be choosing a color from and blend them in the
appropriate proportions relative to how far away the actual point is from
each of the 4 pixels.</p>
<div class="spread">
  <div>
    <div data-diagram="filterCubeMagNearest" style="height: 250px;"></div>
    <div class="code">Nearest</div>
  </div>
  <div>
    <div data-diagram="filterCubeMagLinear" style="height: 250px;"></div>
    <div class="code">Linear</div>
  </div>
</div>

<p>For setting the filter when the texture is drawn smaller than its original size
you set the <a href="/docs/#api/en/textures/Texture#minFilter"><code class="notranslate" translate="no">texture.minFilter</code></a> property to one of 6 values.</p>
<ul>
<li><p><code class="notranslate" translate="no">THREE.NearestFilter</code></p>
<p> same as above, choose the closest pixel in the texture</p>
</li>
<li><p><code class="notranslate" translate="no">THREE.LinearFilter</code></p>
<p> same as above, choose 4 pixels from the texture and blend them</p>
</li>
<li><p><code class="notranslate" translate="no">THREE.NearestMipmapNearestFilter</code></p>
<p> choose the appropriate mip then choose one pixel</p>
</li>
<li><p><code class="notranslate" translate="no">THREE.NearestMipmapLinearFilter</code></p>
<p> choose 2 mips, choose one pixel from each, blend the 2 pixels</p>
</li>
<li><p><code class="notranslate" translate="no">THREE.LinearMipmapNearestFilter</code></p>
<p> chose the appropriate mip then choose 4 pixels and blend them</p>
</li>
<li><p><code class="notranslate" translate="no">THREE.LinearMipmapLinearFilter</code></p>
<p>choose 2 mips, choose 4 pixels from each and blend all 8 into 1 pixel</p>
</li>
</ul>
<p>Here's an example showing all 6 settings</p>
<div class="spread">
  <div data-diagram="filterModes" style="
    height: 450px;
    position: relative;
  ">
    <div style="
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    ">
      <div style="
        background: rgba(255,0,0,.8);
        color: white;
        padding: .5em;
        margin: 1em;
        font-size: small;
        border-radius: .5em;
        line-height: 1.2;
        user-select: none;">click to<br>change<br>texture</div>
    </div>
    <div class="filter-caption" style="left: 0.5em; top: 0.5em;">nearest</div>
    <div class="filter-caption" style="width: 100%; text-align: center; top: 0.5em;">linear</div>
    <div class="filter-caption" style="right: 0.5em; text-align: right; top: 0.5em;">nearest<br>mipmap<br>nearest</div>
    <div class="filter-caption" style="left: 0.5em; text-align: left; bottom: 0.5em;">nearest<br>mipmap<br>linear</div>
    <div class="filter-caption" style="width: 100%; text-align: center; bottom: 0.5em;">linear<br>mipmap<br>nearest</div>
    <div class="filter-caption" style="right: 0.5em; text-align: right; bottom: 0.5em;">linear<br>mipmap<br>linear</div>
  </div>
</div>

<p>One thing to notice is the top left and top middle using <code class="notranslate" translate="no">NearestFilter</code> and <code class="notranslate" translate="no">LinearFilter</code>
don't use the mips. Because of that they flicker in the distance because the GPU is
picking pixels from the original texture. On the left just one pixel is chosen and
in the middle 4 are chosen and blended but it's not enough come up with a good
representative color. The other 4 strips do better with the bottom right,
<code class="notranslate" translate="no">LinearMipmapLinearFilter</code> being best.</p>
<p>If you click the picture above it will toggle between the texture we've been using above
and a texture where every mip level is a different color.</p>
<div class="threejs_center">
  <div data-texture-diagram="differentColoredMips"></div>
</div>

<p>This makes it more clear
what is happening. You can see in the top left and top middle the first mip is used all the way
into the distance. The top right and bottom middle you can clearly see where a different mip
is used.</p>
<p>Switching back to the original texture you can see the bottom right is the smoothest,
highest quality. You might ask why not always use that mode. The most obvious reason
is sometimes you want things to be pixelated for a retro look or some other reason.
The next most common reason is that reading 8 pixels and blending them is slower
than reading 1 pixel and blending. While it's unlikely that a single texture is going
to be the difference between fast and slow as we progress further into these articles
we'll eventually have materials that use 4 or 5 textures all at once. 4 textures * 8
pixels per texture is looking up 32 pixels for ever pixel rendered.
This can be especially important to consider on mobile devices.</p>
<h2 id="-a-name-uvmanipulation-a-repeating-offseting-rotating-wrapping-a-texture"><a name="uvmanipulation"></a> Repeating, offseting, rotating, wrapping a texture</h2>
<p>Textures have settings for repeating, offseting, and rotating a texture.</p>
<p>By default textures in three.js do not repeat. To set whether or not a
texture repeats there are 2 properties, <a href="/docs/#api/en/textures/Texture#wrapS"><code class="notranslate" translate="no">wrapS</code></a> for horizontal wrapping
and <a href="/docs/#api/en/textures/Texture#wrapT"><code class="notranslate" translate="no">wrapT</code></a> for vertical wrapping.</p>
<p>They can be set to one of:</p>
<ul>
<li><p><code class="notranslate" translate="no">THREE.ClampToEdgeWrapping</code></p>
<p> the last pixel on each edge is repeated forever</p>
</li>
<li><p><code class="notranslate" translate="no">THREE.RepeatWrapping</code></p>
<p> the texture is repeated</p>
</li>
<li><p><code class="notranslate" translate="no">THREE.MirroredRepeatWrapping</code></p>
<p> the texture is mirrored and repeated</p>
</li>
</ul>
<p>For example to turn on wrapping in both directions:</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">someTexture.wrapS = THREE.RepeatWrapping;
someTexture.wrapT = THREE.RepeatWrapping;
</pre>
<p>Repeating is set with the [repeat] repeat property.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const timesToRepeatHorizontally = 4;
const timesToRepeatVertically = 2;
someTexture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);
</pre>
<p>Offseting the texture can be done by setting the <code class="notranslate" translate="no">offset</code> property. Textures
are offset with units where 1 unit = 1 texture size. On other words 0 = no offset
and 1 = offset one full texture amount.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const xOffset = .5;   // offset by half the texture
const yOffset = .25;  // offset by 1/4 the texture
someTexture.offset.set(xOffset, yOffset);
</pre>
<p>Rotating the texture can be set by setting the <code class="notranslate" translate="no">rotation</code> property in radians
as well as the <code class="notranslate" translate="no">center</code> property for choosing the center of rotation.
It defaults to 0,0 which rotates from the bottom left corner. Like offset
these units are in texture size so setting them to <code class="notranslate" translate="no">.5, .5</code> would rotate
around the center of the texture.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">someTexture.center.set(.5, .5);
someTexture.rotation = THREE.MathUtils.degToRad(45);
</pre>
<p>Let's modify the top sample above to play with these values</p>
<p>First we'll keep a reference to the texture so we can manipulate it</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const texture = loader.load('resources/images/wall.jpg');
const material = new THREE.MeshBasicMaterial({
-  map: loader.load('resources/images/wall.jpg');
+  map: texture,
});
</pre>
<p>Then we'll use <a href="https://github.com/georgealways/lil-gui">lil-gui</a> again to provide a simple interface.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
</pre>
<p>As we did in previous lil-gui examples we'll use a simple class to
give lil-gui an object that it can manipulate in degrees
but that will set a property in radians.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class DegRadHelper {
  constructor(obj, prop) {
    this.obj = obj;
    this.prop = prop;
  }
  get value() {
    return THREE.MathUtils.radToDeg(this.obj[this.prop]);
  }
  set value(v) {
    this.obj[this.prop] = THREE.MathUtils.degToRad(v);
  }
}
</pre>
<p>We also need a class that will convert from a string like <code class="notranslate" translate="no">"123"</code> into
a number like <code class="notranslate" translate="no">123</code> since three.js requires numbers for enum settings
like <code class="notranslate" translate="no">wrapS</code> and <code class="notranslate" translate="no">wrapT</code> but lil-gui only uses strings for enums.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class StringToNumberHelper {
  constructor(obj, prop) {
    this.obj = obj;
    this.prop = prop;
  }
  get value() {
    return this.obj[this.prop];
  }
  set value(v) {
    this.obj[this.prop] = parseFloat(v);
  }
}
</pre>
<p>Using those classes we can setup a simple GUI for the settings above</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const wrapModes = {
  'ClampToEdgeWrapping': THREE.ClampToEdgeWrapping,
  'RepeatWrapping': THREE.RepeatWrapping,
  'MirroredRepeatWrapping': THREE.MirroredRepeatWrapping,
};

function updateTexture() {
  texture.needsUpdate = true;
}

const gui = new GUI();
gui.add(new StringToNumberHelper(texture, 'wrapS'), 'value', wrapModes)
  .name('texture.wrapS')
  .onChange(updateTexture);
gui.add(new StringToNumberHelper(texture, 'wrapT'), 'value', wrapModes)
  .name('texture.wrapT')
  .onChange(updateTexture);
gui.add(texture.repeat, 'x', 0, 5, .01).name('texture.repeat.x');
gui.add(texture.repeat, 'y', 0, 5, .01).name('texture.repeat.y');
gui.add(texture.offset, 'x', -2, 2, .01).name('texture.offset.x');
gui.add(texture.offset, 'y', -2, 2, .01).name('texture.offset.y');
gui.add(texture.center, 'x', -.5, 1.5, .01).name('texture.center.x');
gui.add(texture.center, 'y', -.5, 1.5, .01).name('texture.center.y');
gui.add(new DegRadHelper(texture, 'rotation'), 'value', -360, 360)
  .name('texture.rotation');
</pre>
<p>The last thing to note about the example is that if you change <code class="notranslate" translate="no">wrapS</code> or
<code class="notranslate" translate="no">wrapT</code> on the texture you must also set <a href="/docs/#api/en/textures/Texture#needsUpdate"><code class="notranslate" translate="no">texture.needsUpdate</code></a>
so three.js knows to apply those settings. The other settings are automatically applied.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/textured-cube-adjust.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/textured-cube-adjust.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>This is only one step into the topic of textures. At some point we'll go over
texture coordinates as well as 9 other types of textures that can be applied
to materials.</p>
<p>For now let's move on to <a href="lights.html">lights</a>.</p>
<!--
alpha
ao
env
light
specular
bumpmap ?
normalmap ?
metalness
roughness
-->
<p><link rel="stylesheet" href="../resources/threejs-textures.css"></p>
<script type="module" src="../resources/threejs-textures.js"></script>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# tips.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Tips</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Tips">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Tips</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>This article is a collection of small issues you might run into
using three.js that seemed too small to have their own article.</p>
<hr>
<p><a id="screenshot" data-toc="Taking a screenshot"></a></p>
<h1 id="taking-a-screenshot-of-the-canvas">Taking A Screenshot of the Canvas</h1>
<p>In the browser there are effectively 2 functions that will take a screenshot.
The old one
<a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL"><code class="notranslate" translate="no">canvas.toDataURL</code></a>
and the new better one
<a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob"><code class="notranslate" translate="no">canvas.toBlob</code></a></p>
<p>So you'd think it would be easy to take a screenshot by just adding some code like</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;canvas id="c"&gt;&lt;/canvas&gt;
+&lt;button id="screenshot" type="button"&gt;Save...&lt;/button&gt;
</pre>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const elem = document.querySelector('#screenshot');
elem.addEventListener('click', () =&gt; {
  canvas.toBlob((blob) =&gt; {
    saveBlob(blob, `screencapture-${canvas.width}x${canvas.height}.png`);
  });
});

const saveBlob = (function() {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style.display = 'none';
  return function saveData(blob, fileName) {
     const url = window.URL.createObjectURL(blob);
     a.href = url;
     a.download = fileName;
     a.click();
  };
}());
</pre>
<p>Here's the example from <a href="responsive.html">the article on responsiveness</a>
with the code above added and some CSS to place the button</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/tips-screenshot-bad.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/tips-screenshot-bad.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>When I tried it I got this screenshot</p>
<div class="threejs_center"><img src="../resources/images/screencapture-413x313.png"></div>

<p>Yes, it's just a black image.</p>
<p>It's possible it worked for you depending on your browser/OS but in general
it's not likely to work.</p>
<p>The issue is that for performance and compatibility reasons, by default the browser
will clear a WebGL canvas's drawing buffer after you've drawn to it.</p>
<p>The solution is to call your rendering code just before capturing.</p>
<p>In our code we need to adjust a few things. First let's separate
out the rendering code.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const state = {
+  time: 0,
+};

-function render(time) {
-  time *= 0.001;
+function render() {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  cubes.forEach((cube, ndx) =&gt; {
    const speed = 1 + ndx * .1;
-    const rot = time * speed;
+    const rot = state.time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });

  renderer.render(scene, camera);

-  requestAnimationFrame(render);
}

+function animate(time) {
+  state.time = time * 0.001;
+
+  render();
+
+  requestAnimationFrame(animate);
+}
+requestAnimationFrame(animate);
</pre>
<p>Now that <code class="notranslate" translate="no">render</code> is only concerned with actually rendering
we can call it just before capturing the canvas.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const elem = document.querySelector('#screenshot');
elem.addEventListener('click', () =&gt; {
+  render();
  canvas.toBlob((blob) =&gt; {
    saveBlob(blob, `screencapture-${canvas.width}x${canvas.height}.png`);
  });
});
</pre>
<p>And now it should work.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/tips-screenshot-good.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/tips-screenshot-good.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>For a different solution see the next item.</p>
<hr>
<p><a id="preservedrawingbuffer" data-toc="Prevent the Canvas Being Cleared"></a></p>
<h1 id="preventing-the-canvas-being-cleared">Preventing the canvas being cleared</h1>
<p>Let's say you wanted to let the user paint with an animated
object. You need to pass in <code class="notranslate" translate="no">preserveDrawingBuffer: true</code> when
you create the <a href="/docs/#api/en/renderers/WebGLRenderer"><code class="notranslate" translate="no">WebGLRenderer</code></a>. This prevents the browser from
clearing the canvas. You also need to tell three.js not to clear
the canvas as well.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const canvas = document.querySelector('#c');
-const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
+const renderer = new THREE.WebGLRenderer({
+  canvas,
+  preserveDrawingBuffer: true,
+  alpha: true,
+});
+renderer.autoClearColor = false;
</pre>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/tips-preservedrawingbuffer.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/tips-preservedrawingbuffer.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Note that if you were serious about making a drawing program this would not be a
solution as the browser will still clear the canvas anytime we change its
resolution. We're changing is resolution based on its display size. Its display
size changes when the window changes size. That includes when the user downloads
a file, even in another tab, and the browser adds a status bar. It also includes when
the user turns their phone and the browser switches from portrait to landscape.</p>
<p>If you really wanted to make a drawing program you'd
<a href="rendertargets.html">render to a texture using a render target</a>.</p>
<hr>
<p><a id="tabindex" data-toc="Get Keyboard Input From a Canvas"></a></p>
<h1 id="getting-keyboard-input">Getting Keyboard Input</h1>
<p>Throughout these tutorials we've often attached event listeners to the <code class="notranslate" translate="no">canvas</code>.
While many events work, one that does not work by default is keyboard
events.</p>
<p>To get keyboard events, set the <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex"><code class="notranslate" translate="no">tabindex</code></a>
of the canvas to 0 or more. Eg.</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;canvas tabindex="0"&gt;&lt;/canvas&gt;
</pre>
<p>This ends up causing a new issue though. Anything that has a <code class="notranslate" translate="no">tabindex</code> set
will get highlighted when it has the focus. To fix that set its focus CSS outline
to none</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">canvas:focus {
  outline:none;
}
</pre>
<p>To demonstrate here are 3 canvases </p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;canvas id="c1"&gt;&lt;/canvas&gt;
&lt;canvas id="c2" tabindex="0"&gt;&lt;/canvas&gt;
&lt;canvas id="c3" tabindex="1"&gt;&lt;/canvas&gt;
</pre>
<p>and some css just for the last canvas </p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">#c3:focus {
    outline: none;
}
</pre>
<p>Let's attach the same event listeners to all of them</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">document.querySelectorAll('canvas').forEach((canvas) =&gt; {
  const ctx = canvas.getContext('2d');

  function draw(str) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(str, canvas.width / 2, canvas.height / 2);
  }
  draw(canvas.id);

  canvas.addEventListener('focus', () =&gt; {
    draw('has focus press a key');
  });

  canvas.addEventListener('blur', () =&gt; {
    draw('lost focus');
  });

  canvas.addEventListener('keydown', (e) =&gt; {
    draw(`keyCode: ${e.keyCode}`);
  });
});
</pre>
<p>Notice you can't get the first canvas to accept keyboard input.
The second canvas you can but it gets highlighted. The 3rd
canvas has both solutions applied.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/tips-tabindex.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/tips-tabindex.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<hr>
<p><a id="transparent-canvas" data-toc="Make the Canvas Transparent"></a></p>
<h1 id="making-the-canvas-transparent">Making the Canvas Transparent</h1>
<p>By default THREE.js makes the canvas opaque. If you want the
canvas to be transparent pass in <a href="/docs/#api/en/renderers/WebGLRenderer#alpha"><code class="notranslate" translate="no">alpha:true</code></a> when you create
the <a href="/docs/#api/en/renderers/WebGLRenderer"><code class="notranslate" translate="no">WebGLRenderer</code></a></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const canvas = document.querySelector('#c');
-const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
+const renderer = new THREE.WebGLRenderer({
+  canvas,
+  alpha: true,
+});
</pre>
<p>You probably also want to tell it that your results are <strong>not</strong> using premultiplied alpha</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
+  premultipliedAlpha: false,
});
</pre>
<p>Three.js defaults to the canvas using
<a href="/docs/#api/en/renderers/WebGLRenderer#premultipliedAlpha"><code class="notranslate" translate="no">premultipliedAlpha: true</code></a> but defaults
to materials outputting <a href="/docs/#api/en/materials/Material#premultipliedAlpha"><code class="notranslate" translate="no">premultipliedAlpha: false</code></a>.</p>
<p>If you'd like a better understanding of when and when not to use premultiplied alpha
here's <a href="https://developer.nvidia.com/content/alpha-blending-pre-or-not-pre">a good article on it</a>.</p>
<p>In any case let's setup a simple example with a transparent canvas.</p>
<p>We applied the settings above to the example from <a href="responsive.html">the article on responsiveness</a>.
Let's also make the materials more transparent.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function makeInstance(geometry, color, x) {
-  const material = new THREE.MeshPhongMaterial({color});
+  const material = new THREE.MeshPhongMaterial({
+    color,
+    opacity: 0.5,
+  });

...
</pre>
<p>And let's add some HTML content</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;body&gt;
  &lt;canvas id="c"&gt;&lt;/canvas&gt;
+  &lt;div id="content"&gt;
+    &lt;div&gt;
+      &lt;h1&gt;Cubes-R-Us!&lt;/h1&gt;
+      &lt;p&gt;We make the best cubes!&lt;/p&gt;
+    &lt;/div&gt;
+  &lt;/div&gt;
&lt;/body&gt;
</pre>
<p>as well as some CSS to put the canvas in front</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">body {
    margin: 0;
}
#c {
    width: 100%;
    height: 100%;
    display: block;
+    position: fixed;
+    left: 0;
+    top: 0;
+    z-index: 2;
+    pointer-events: none;
}
+#content {
+  font-size: 7vw;
+  font-family: sans-serif;
+  text-align: center;
+  width: 100%;
+  height: 100%;
+  display: flex;
+  justify-content: center;
+  align-items: center;
+}
</pre>
<p>note that <code class="notranslate" translate="no">pointer-events: none</code> makes the canvas invisible to the mouse
and touch events so you can select the text beneath.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/tips-transparent-canvas.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/tips-transparent-canvas.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<hr>
<p><a id="html-background" data-toc="Use three.js as Background in HTML"></a></p>
<h1 id="making-your-background-a-three-js-animation">Making your background a three.js animation</h1>
<p>A common question is how to make a three.js animation be the background of
a webpage.</p>
<p>There are 2 obvious ways.</p>
<ul>
<li>Set the canvas CSS <code class="notranslate" translate="no">position</code> to <code class="notranslate" translate="no">fixed</code> as in</li>
</ul>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">#c {
 position: fixed;
 left: 0;
 top: 0;
 ...
}
</pre>
<p>You can basically see this exact solution on the previous example. Just set <code class="notranslate" translate="no">z-index</code> to -1
and the cubes will appear behind the text.</p>
<p>A small disadvantage to this solution is your JavaScript must integrate with the page
and if you have a complex page then you need to make sure none of the JavaScript in your
three.js visualization conflict with the JavaScript doing other things in the page.</p>
<ul>
<li>Use an <code class="notranslate" translate="no">iframe</code></li>
</ul>
<p>This is the solution used on <a href="/">the front page of this site</a>.</p>
<p>In your webpage just insert an iframe, for example</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;iframe id="background" src="responsive.html"&gt;
&lt;div&gt;
  Your content goes here.
&lt;/div&gt;
</pre>
<p>Then style the iframe to fill the window and be in the background
which is basically the same code as we used above for the canvas
except we also need to set <code class="notranslate" translate="no">border</code> to <code class="notranslate" translate="no">none</code> since iframes have
a border by default.</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">#background {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: -1;
    border: none;
    pointer-events: none;
}
</pre><p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/tips-html-background.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/tips-html-background.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# transparency.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Transparency</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Transparency">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Transparency</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>Transparency in three.js is both easy and hard.</p>
<p>First we'll go over the easy part. Let's make a
scene with 8 cubes placed in a 2x2x2 grid.</p>
<p>We'll start with the example from
<a href="rendering-on-demand.html">the article on rendering on demand</a>
which had 3 cubes and modify it to have 8. First
let's change our <code class="notranslate" translate="no">makeInstance</code> function to take
an x, y, and z</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-function makeInstance(geometry, color) {
+function makeInstance(geometry, color, x, y, z) {
  const material = new THREE.MeshPhongMaterial({color});

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

-  cube.position.x = x;
+  cube.position.set(x, y, z);

  return cube;
}
</pre>
<p>Then we can create 8 cubes</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+function hsl(h, s, l) {
+  return (new THREE.Color()).setHSL(h, s, l);
+}

-makeInstance(geometry, 0x44aa88,  0);
-makeInstance(geometry, 0x8844aa, -2);
-makeInstance(geometry, 0xaa8844,  2);

+{
+  const d = 0.8;
+  makeInstance(geometry, hsl(0 / 8, 1, .5), -d, -d, -d);
+  makeInstance(geometry, hsl(1 / 8, 1, .5),  d, -d, -d);
+  makeInstance(geometry, hsl(2 / 8, 1, .5), -d,  d, -d);
+  makeInstance(geometry, hsl(3 / 8, 1, .5),  d,  d, -d);
+  makeInstance(geometry, hsl(4 / 8, 1, .5), -d, -d,  d);
+  makeInstance(geometry, hsl(5 / 8, 1, .5),  d, -d,  d);
+  makeInstance(geometry, hsl(6 / 8, 1, .5), -d,  d,  d);
+  makeInstance(geometry, hsl(7 / 8, 1, .5),  d,  d,  d);
+}
</pre>
<p>I also adjusted the camera</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.1;
-const far = 5;
+const far = 25;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
-camera.position.z = 4;
+camera.position.z = 2;
</pre>
<p>Set the background to white</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const scene = new THREE.Scene();
+scene.background = new THREE.Color('white');
</pre>
<p>And added a second light so all sides of the cubes get some lighting.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-{
+function addLight(...pos) {
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
-  light.position.set(-1, 2, 4);
+  light.position.set(...pos);
  scene.add(light);
}
+addLight(-1, 2, 4);
+addLight( 1, -1, -2);
</pre>
<p>To make the cubes transparent we just need to set the
<a href="/docs/#api/en/materials/Material#transparent"><code class="notranslate" translate="no">transparent</code></a> flag and to set an
<a href="/docs/#api/en/materials/Material#opacity"><code class="notranslate" translate="no">opacity</code></a> level with 1 being completely opaque
and 0 being completely transparent.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function makeInstance(geometry, color, x, y, z) {
-  const material = new THREE.MeshPhongMaterial({color});
+  const material = new THREE.MeshPhongMaterial({
+    color,
+    opacity: 0.5,
+    transparent: true,
+  });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.set(x, y, z);

  return cube;
}
</pre>
<p>and with that we get 8 transparent cubes</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/transparency.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/transparency.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Drag on the example to rotate the view. </p>
<p>So it seems easy but ... look closer. The cubes are
missing their backs.</p>
<div class="threejs_center"><img src="../resources/images/transparency-cubes-no-backs.png" style="width: 416px;"></div>
<div class="threejs_center">no backs</div>

<p>We learned about the <a href="/docs/#api/en/materials/Material#side"><code class="notranslate" translate="no">side</code></a> material property in
<a href="materials.html">the article on materials</a>.
So, let's set it to <code class="notranslate" translate="no">THREE.DoubleSide</code> to get both sides of each cube to be drawn.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const material = new THREE.MeshPhongMaterial({
  color,
  map: loader.load(url),
  opacity: 0.5,
  transparent: true,
+  side: THREE.DoubleSide,
});
</pre>
<p>And we get</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/transparency-doubleside.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/transparency-doubleside.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Give it a spin. It kind of looks like it's working as we can see backs
except on closer inspection sometimes we can't.</p>
<div class="threejs_center"><img src="../resources/images/transparency-cubes-some-backs.png" style="width: 368px;"></div>
<div class="threejs_center">the left back face of each cube is missing</div>

<p>This happens because of the way 3D objects are generally drawn. For each geometry
each triangle is drawn one at a time. When each pixel of the triangle is drawn
2 things are recorded. One, the color for that pixel and two, the depth of that pixel.
When the next triangle is drawn, for each pixel if the depth is deeper than the
previously recorded depth no pixel is drawn.</p>
<p>This works great for opaque things but it fails for transparent things.</p>
<p>The solution is to sort transparent things and draw the stuff in back before
drawing the stuff in front. THREE.js does this for objects like <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> otherwise
the very first example would have failed between cubes with some cubes blocking
out others. Unfortunately for individual triangles shorting would be extremely slow. </p>
<p>The cube has 12 triangles, 2 for each face, and the order they are drawn is
<a href="custom-buffergeometry.html">the same order they are built in the geometry</a>
so depending on which direction we are looking the triangles closer to the camera
might get drawn first. In that case the triangles in the back aren't drawn.
This is why sometimes we don't see the backs.</p>
<p>For a convex object like a sphere or a cube one kind of solution is to add
every cube to the scene twice. Once with a material that draws
only the back facing triangles and another with a material that only
draws the front facing triangles.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function makeInstance(geometry, color, x, y, z) {
+  [THREE.BackSide, THREE.FrontSide].forEach((side) =&gt; {
    const material = new THREE.MeshPhongMaterial({
      color,
      opacity: 0.5,
      transparent: true,
+      side,
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.set(x, y, z);
+  });
}
</pre>
<p>Any with that it <em>seems</em> to work.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/transparency-doubleside-hack.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/transparency-doubleside-hack.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>It assumes that the three.js's sorting is stable. Meaning that because we
added the <code class="notranslate" translate="no">side: THREE.BackSide</code> mesh first and because it's at the exact same
position that it will be drawn before the <code class="notranslate" translate="no">side: THREE.FrontSide</code> mesh.</p>
<p>Let's make 2 intersecting planes (after deleting all the code related to cubes).
We'll <a href="textures.html">add a texture</a> to each plane.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const planeWidth = 1;
const planeHeight = 1;
const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

const loader = new THREE.TextureLoader();

function makeInstance(geometry, color, rotY, url) {
  const texture = loader.load(url, render);
  const material = new THREE.MeshPhongMaterial({
    color,
    map: texture,
    opacity: 0.5,
    transparent: true,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  mesh.rotation.y = rotY;
}

makeInstance(geometry, 'pink',       0,             'resources/images/happyface.png');
makeInstance(geometry, 'lightblue',  Math.PI * 0.5, 'resources/images/hmmmface.png');
</pre>
<p>This time we can use <code class="notranslate" translate="no">side: THREE.DoubleSide</code> since we can only ever see one
side of a plane at a time. Also note we pass our <code class="notranslate" translate="no">render</code> function to the texture
loading function so that when the texture finishes loading we re-render the scene.
This is because this sample is <a href="rendering-on-demand.html">rendering on demand</a>
instead of rendering continuously.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/transparency-intersecting-planes.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/transparency-intersecting-planes.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>And again we see a similar issue.</p>
<div class="threejs_center"><img src="../resources/images/transparency-planes.png" style="width: 408px;"></div>
<div class="threejs_center">half a face is missing</div>

<p>The solution here is to manually split the each pane into 2 panes
so that there really is no intersection.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function makeInstance(geometry, color, rotY, url) {
+  const base = new THREE.Object3D();
+  scene.add(base);
+  base.rotation.y = rotY;

+  [-1, 1].forEach((x) =&gt; {
    const texture = loader.load(url, render);
+    texture.offset.x = x &lt; 0 ? 0 : 0.5;
+    texture.repeat.x = .5;
    const material = new THREE.MeshPhongMaterial({
      color,
      map: texture,
      opacity: 0.5,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
-    scene.add(mesh);
+    base.add(mesh);

-    mesh.rotation.y = rotY;
+    mesh.position.x = x * .25;
  });
}
</pre>
<p>How you accomplish that is up to you. If I was using modeling package like
<a href="https://blender.org">Blender</a> I'd probably do this manually by adjusting
texture coordinates. Here though we're using <a href="/docs/#api/en/geometries/PlaneGeometry"><code class="notranslate" translate="no">PlaneGeometry</code></a> which by
default stretches the texture across the plane. Like we <a href="textures.html">covered
before</a> By setting the <a href="/docs/#api/en/textures/Texture#repeat"><code class="notranslate" translate="no">texture.repeat</code></a>
and <a href="/docs/#api/en/textures/Texture#offset"><code class="notranslate" translate="no">texture.offset</code></a> we can scale and move the texture to get
the correct half of the face texture on each plane.</p>
<p>The code above also makes a <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> and parents the 2 planes to it.
It seemed easier to rotate a parent <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> than to do the math
required do it without. </p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/transparency-intersecting-planes-fixed.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/transparency-intersecting-planes-fixed.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>This solution really only works for simple things like 2 planes that
are not changing their intersection position.</p>
<p>For textured objects one more solution is to set an alpha test.</p>
<p>An alpha test is a level of <em>alpha</em> below which three.js will not
draw the pixel. If we don't draw a pixel at all then the depth
issues mentioned above disappear. For relatively sharp edged textures
this works pretty well. Examples include leaf textures on a plant or tree
or often a patch of grass.</p>
<p>Let's try on the 2 planes. First let's use different textures.
The textures above were 100% opaque. These 2 use transparency.</p>
<div class="spread">
  <div><img class="checkerboard" src="../examples/resources/images/tree-01.png"></div>
  <div><img class="checkerboard" src="../examples/resources/images/tree-02.png"></div>
</div>

<p>Going back to the 2 planes that intersect (before we split them) let's
use these textures and set an <a href="/docs/#api/en/materials/Material#alphaTest"><code class="notranslate" translate="no">alphaTest</code></a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function makeInstance(geometry, color, rotY, url) {
  const texture = loader.load(url, render);
  const material = new THREE.MeshPhongMaterial({
    color,
    map: texture,
-    opacity: 0.5,
    transparent: true,
+    alphaTest: 0.5,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  mesh.rotation.y = rotY;
}

-makeInstance(geometry, 'pink',       0,             'resources/images/happyface.png');
-makeInstance(geometry, 'lightblue',  Math.PI * 0.5, 'resources/images/hmmmface.png');
+makeInstance(geometry, 'white', 0,             'resources/images/tree-01.png');
+makeInstance(geometry, 'white', Math.PI * 0.5, 'resources/images/tree-02.png');
</pre>
<p>Before we run this let's add a small UI so we can more easily play with the <code class="notranslate" translate="no">alphaTest</code>
and <code class="notranslate" translate="no">transparent</code> settings. We'll use lil-gui like we introduced
in the <a href="scenegraph.html">article on three.js's scenegraph</a>.</p>
<p>First we'll make a helper for lil-gui that sets every material in the scene
to a value</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class AllMaterialPropertyGUIHelper {
  constructor(prop, scene) {
    this.prop = prop;
    this.scene = scene;
  }
  get value() {
    const {scene, prop} = this;
    let v;
    scene.traverse((obj) =&gt; {
      if (obj.material &amp;&amp; obj.material[prop] !== undefined) {
        v = obj.material[prop];
      }
    });
    return v;
  }
  set value(v) {
    const {scene, prop} = this;
    scene.traverse((obj) =&gt; {
      if (obj.material &amp;&amp; obj.material[prop] !== undefined) {
        obj.material[prop] = v;
        obj.material.needsUpdate = true;
      }
    });
  }
}
</pre>
<p>Then we'll add the gui</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const gui = new GUI();
gui.add(new AllMaterialPropertyGUIHelper('alphaTest', scene), 'value', 0, 1)
    .name('alphaTest')
    .onChange(requestRenderIfNotRequested);
gui.add(new AllMaterialPropertyGUIHelper('transparent', scene), 'value')
    .name('transparent')
    .onChange(requestRenderIfNotRequested);
</pre>
<p>and of course we need to include lil-gui</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
+import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
</pre>
<p>and here's the results</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/transparency-intersecting-planes-alphatest.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/transparency-intersecting-planes-alphatest.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>You can see it works but zoom in and you'll see one plane has white lines.</p>
<div class="threejs_center"><img src="../resources/images/transparency-alphatest-issues.png" style="width: 532px;"></div>

<p>This is the same depth issue from before. That plane was drawn first
so the plane behind is not drawn. There is no perfect solution.
Adjust the <code class="notranslate" translate="no">alphaTest</code> and/or turn off <code class="notranslate" translate="no">transparent</code> to find a solution
that fits your use case.</p>
<p>The take way from this article is perfect transparency is hard.
There are issues and trade offs and workarounds.</p>
<p>For example say you have a car.
Cars usually have windshields on all 4 sides. If you want to avoid the sorting issues
above you'd have to make each window its own object so that three.js can
sort the windows and draw them in the correct order.</p>
<p>If you are making some plants or grass the alpha test solution is common.</p>
<p>Which solution you pick depends on your needs. </p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# voxel-geometry.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>Voxel(Minecraft Like) Geometry</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – Voxel(Minecraft Like) Geometry">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>Voxel(Minecraft Like) Geometry</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>I've seen this topic come up more than once in various places.
That is basically, "How do I make a voxel display like Minecraft".</p>
<p>Most people first attempt this by making a cube geometry and then
making a mesh at each voxel position. Just for fun I tried
this. I made a 16777216 element <code class="notranslate" translate="no">Uint8Array</code> to represent
a 256x256x256 cube of voxels.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const cellSize = 256;
const cell = new Uint8Array(cellSize * cellSize * cellSize);
</pre>
<p>I then made a single layer with a kind of hills of
sine waves like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">for (let y = 0; y &lt; cellSize; ++y) {
  for (let z = 0; z &lt; cellSize; ++z) {
    for (let x = 0; x &lt; cellSize; ++x) {
      const height = (Math.sin(x / cellSize * Math.PI * 4) + Math.sin(z / cellSize * Math.PI * 6)) * 20 + cellSize / 2;
      if (height &gt; y &amp;&amp; height &lt; y + 1) {
        const offset = y * cellSize * cellSize +
                       z * cellSize +
                       x;
        cell[offset] = 1;
      }
    }
  }
}
</pre>
<p>I then walked through all the cells and if they were not
0 I created a mesh with a cube.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({color: 'green'});

for (let y = 0; y &lt; cellSize; ++y) {
  for (let z = 0; z &lt; cellSize; ++z) {
    for (let x = 0; x &lt; cellSize; ++x) {
      const offset = y * cellSize * cellSize +
                     z * cellSize +
                     x;
      const block = cell[offset];
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      scene.add(mesh);
    }
  }
}
</pre>
<p>The rest of the code is based on the example from
<a href="rendering-on-demand.html">the article on rendering on demand</a>.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/voxel-geometry-separate-cubes.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/voxel-geometry-separate-cubes.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>It takes a while to start and if you try to move the camera
it's likely too slow. Like <a href="optimize-lots-of-objects.html">the article on how to optimize lots of objects</a>
the problem is there are just way too many objects. 256x256
is 65536 boxes!</p>
<p>Using <a href="rendering-on-demand.html">the technique of merging the geometry</a>
will fix the issue for this example but what if instead of just making
a single layer we filled in everything below the ground with voxel.
In other words change the loop filling in the voxels to this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">for (let y = 0; y &lt; cellSize; ++y) {
  for (let z = 0; z &lt; cellSize; ++z) {
    for (let x = 0; x &lt; cellSize; ++x) {
      const height = (Math.sin(x / cellSize * Math.PI * 4) + Math.sin(z / cellSize * Math.PI * 6)) * 20 + cellSize / 2;
-      if (height &gt; y &amp;&amp; height &lt; y + 1) {
+      if (height &lt; y + 1) {
        const offset = y * cellSize * cellSize +
                       z * cellSize +
                       x;
        cell[offset] = 1;
      }
    }
  }
}
</pre>
<p>I tried it once just to see the results. It churned for
about a minute and then crashed with <em>out of memory</em> 😅</p>
<p>There are several issues but the biggest issue is
we're making all these faces inside the cubes that
we can actually never see.</p>
<p>In other words lets say we have a box of voxels
3x2x2. By merging cubes we're getting this</p>
<div class="spread">
  <div data-diagram="mergedCubes" style="height: 300px;"></div>
</div>

<p>but we really want this</p>
<div class="spread">
  <div data-diagram="culledCubes" style="height: 300px;"></div>
</div>

<p>In the top box there are faces between the voxels. Faces
that are a waste since they can't be seen. It's not just
one face between each voxel, there are 2 faces, one for
each voxel facing its neighbor that are a waste. All these extra faces,
especially for a large volume of voxels will kill performance.</p>
<p>It should be clear that we can't just merge geometry.
We need to build it ourselves, taking into account that
if a voxel has an adjacent neighbor it doesn't need the
face facing that neighbor.</p>
<p>The next issue is that 256x256x256 is just too big. 16meg is a lot of memory and
if nothing else in much of the space nothing is there so that's a lot of wasted
memory. It's also a huge number of voxels, 16 million! That's too much to
consider at once.</p>
<p>A solution is to divide the area into smaller areas.
Any area that has nothing in it needs no storage. Let's use
32x32x32 areas (that's 32k) and only create an area if something is in it.
We'll call one of these larger 32x32x32 areas a "cell".</p>
<p>Let's break this into pieces. First let's make a class to manage the voxel data.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class VoxelWorld {
  constructor(cellSize) {
    this.cellSize = cellSize;
  }
}
</pre>
<p>Let's make the function that makes geometry for a cell.
Let's assume you pass in a cell position.
In other words if you want the geometry for the cell that covers voxels (0-31x, 0-31y, 0-31z)
then you'd pass in 0,0,0. For the cell that covers voxels (32-63x, 0-31y, 0-31z) you'd
pass in 1,0,0.</p>
<p>We need to be able to check the neighboring voxels so let's assume our class
has a function <code class="notranslate" translate="no">getVoxel</code> that given a voxel position returns the value of
the voxel there. In other words if you pass it 35,0,0 and the cellSize is 32
it's going to look at cell 1,0,0 and in that cell it will look at voxel 3,0,0.
Using this function we can look at a voxel's neighboring voxels even if they
happen to be in neighboring cells.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class VoxelWorld {
  constructor(cellSize) {
    this.cellSize = cellSize;
  }
+  generateGeometryDataForCell(cellX, cellY, cellZ) {
+    const {cellSize} = this;
+    const startX = cellX * cellSize;
+    const startY = cellY * cellSize;
+    const startZ = cellZ * cellSize;
+
+    for (let y = 0; y &lt; cellSize; ++y) {
+      const voxelY = startY + y;
+      for (let z = 0; z &lt; cellSize; ++z) {
+        const voxelZ = startZ + z;
+        for (let x = 0; x &lt; cellSize; ++x) {
+          const voxelX = startX + x;
+          const voxel = this.getVoxel(voxelX, voxelY, voxelZ);
+          if (voxel) {
+            for (const {dir} of VoxelWorld.faces) {
+              const neighbor = this.getVoxel(
+                  voxelX + dir[0],
+                  voxelY + dir[1],
+                  voxelZ + dir[2]);
+              if (!neighbor) {
+                // this voxel has no neighbor in this direction so we need a face
+                // here.
+              }
+            }
+          }
+        }
+      }
+    }
+  }
}

+VoxelWorld.faces = [
+  { // left
+    dir: [ -1,  0,  0, ],
+  },
+  { // right
+    dir: [  1,  0,  0, ],
+  },
+  { // bottom
+    dir: [  0, -1,  0, ],
+  },
+  { // top
+    dir: [  0,  1,  0, ],
+  },
+  { // back
+    dir: [  0,  0, -1, ],
+  },
+  { // front
+    dir: [  0,  0,  1, ],
+  },
+];
</pre>
<p>So using the code above we know when we need a face. Let's generate the faces.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class VoxelWorld {
  constructor(cellSize) {
    this.cellSize = cellSize;
  }
  generateGeometryDataForCell(cellX, cellY, cellZ) {
    const {cellSize} = this;
+    const positions = [];
+    const normals = [];
+    const indices = [];
    const startX = cellX * cellSize;
    const startY = cellY * cellSize;
    const startZ = cellZ * cellSize;

    for (let y = 0; y &lt; cellSize; ++y) {
      const voxelY = startY + y;
      for (let z = 0; z &lt; cellSize; ++z) {
        const voxelZ = startZ + z;
        for (let x = 0; x &lt; cellSize; ++x) {
          const voxelX = startX + x;
          const voxel = this.getVoxel(voxelX, voxelY, voxelZ);
          if (voxel) {
-            for (const {dir} of VoxelWorld.faces) {
+            for (const {dir, corners} of VoxelWorld.faces) {
              const neighbor = this.getVoxel(
                  voxelX + dir[0],
                  voxelY + dir[1],
                  voxelZ + dir[2]);
              if (!neighbor) {
                // this voxel has no neighbor in this direction so we need a face.
+                const ndx = positions.length / 3;
+                for (const pos of corners) {
+                  positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
+                  normals.push(...dir);
+                }
+                indices.push(
+                  ndx, ndx + 1, ndx + 2,
+                  ndx + 2, ndx + 1, ndx + 3,
+                );
              }
            }
          }
        }
      }
    }
+    return {
+      positions,
+      normals,
+      indices,
    };
  }
}

VoxelWorld.faces = [
  { // left
    dir: [ -1,  0,  0, ],
+    corners: [
+      [ 0, 1, 0 ],
+      [ 0, 0, 0 ],
+      [ 0, 1, 1 ],
+      [ 0, 0, 1 ],
+    ],
  },
  { // right
    dir: [  1,  0,  0, ],
+    corners: [
+      [ 1, 1, 1 ],
+      [ 1, 0, 1 ],
+      [ 1, 1, 0 ],
+      [ 1, 0, 0 ],
+    ],
  },
  { // bottom
    dir: [  0, -1,  0, ],
+    corners: [
+      [ 1, 0, 1 ],
+      [ 0, 0, 1 ],
+      [ 1, 0, 0 ],
+      [ 0, 0, 0 ],
+    ],
  },
  { // top
    dir: [  0,  1,  0, ],
+    corners: [
+      [ 0, 1, 1 ],
+      [ 1, 1, 1 ],
+      [ 0, 1, 0 ],
+      [ 1, 1, 0 ],
+    ],
  },
  { // back
    dir: [  0,  0, -1, ],
+    corners: [
+      [ 1, 0, 0 ],
+      [ 0, 0, 0 ],
+      [ 1, 1, 0 ],
+      [ 0, 1, 0 ],
+    ],
  },
  { // front
    dir: [  0,  0,  1, ],
+    corners: [
+      [ 0, 0, 1 ],
+      [ 1, 0, 1 ],
+      [ 0, 1, 1 ],
+      [ 1, 1, 1 ],
+    ],
  },
];
</pre>
<p>The code above would make basic geometry data for us. We just need to supply
the <code class="notranslate" translate="no">getVoxel</code> function. Let's start with just one hard coded cell.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class VoxelWorld {
  constructor(cellSize) {
    this.cellSize = cellSize;
+    this.cell = new Uint8Array(cellSize * cellSize * cellSize);
  }
+  getCellForVoxel(x, y, z) {
+    const {cellSize} = this;
+    const cellX = Math.floor(x / cellSize);
+    const cellY = Math.floor(y / cellSize);
+    const cellZ = Math.floor(z / cellSize);
+    if (cellX !== 0 || cellY !== 0 || cellZ !== 0) {
+      return null
+    }
+    return this.cell;
+  }
+  getVoxel(x, y, z) {
+    const cell = this.getCellForVoxel(x, y, z);
+    if (!cell) {
+      return 0;
+    }
+    const {cellSize} = this;
+    const voxelX = THREE.MathUtils.euclideanModulo(x, cellSize) | 0;
+    const voxelY = THREE.MathUtils.euclideanModulo(y, cellSize) | 0;
+    const voxelZ = THREE.MathUtils.euclideanModulo(z, cellSize) | 0;
+    const voxelOffset = voxelY * cellSize * cellSize +
+                        voxelZ * cellSize +
+                        voxelX;
+    return cell[voxelOffset];
+  }
  generateGeometryDataForCell(cellX, cellY, cellZ) {

  ...
}
</pre>
<p>This seems like it would work. Let's make a <code class="notranslate" translate="no">setVoxel</code> function
so we can set some data.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class VoxelWorld {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.cell = new Uint8Array(cellSize * cellSize * cellSize);
  }
  getCellForVoxel(x, y, z) {
    const {cellSize} = this;
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    const cellZ = Math.floor(z / cellSize);
    if (cellX !== 0 || cellY !== 0 || cellZ !== 0) {
      return null
    }
    return this.cell;
  }
+  setVoxel(x, y, z, v) {
+    let cell = this.getCellForVoxel(x, y, z);
+    if (!cell) {
+      return;  // TODO: add a new cell?
+    }
+    const {cellSize} = this;
+    const voxelX = THREE.MathUtils.euclideanModulo(x, cellSize) | 0;
+    const voxelY = THREE.MathUtils.euclideanModulo(y, cellSize) | 0;
+    const voxelZ = THREE.MathUtils.euclideanModulo(z, cellSize) | 0;
+    const voxelOffset = voxelY * cellSize * cellSize +
+                        voxelZ * cellSize +
+                        voxelX;
+    cell[voxelOffset] = v;
+  }
  getVoxel(x, y, z) {
    const cell = this.getCellForVoxel(x, y, z);
    if (!cell) {
      return 0;
    }
    const {cellSize} = this;
    const voxelX = THREE.MathUtils.euclideanModulo(x, cellSize) | 0;
    const voxelY = THREE.MathUtils.euclideanModulo(y, cellSize) | 0;
    const voxelZ = THREE.MathUtils.euclideanModulo(z, cellSize) | 0;
    const voxelOffset = voxelY * cellSize * cellSize +
                        voxelZ * cellSize +
                        voxelX;
    return cell[voxelOffset];
  }
  generateGeometryDataForCell(cellX, cellY, cellZ) {

  ...
}
</pre>
<p>Hmmm, I see a lot of repeated code. Let's fix that up</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class VoxelWorld {
  constructor(cellSize) {
    this.cellSize = cellSize;
+    this.cellSliceSize = cellSize * cellSize;
    this.cell = new Uint8Array(cellSize * cellSize * cellSize);
  }
  getCellForVoxel(x, y, z) {
    const {cellSize} = this;
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    const cellZ = Math.floor(z / cellSize);
    if (cellX !== 0 || cellY !== 0 || cellZ !== 0) {
      return null;
    }
    return this.cell;
  }
+  computeVoxelOffset(x, y, z) {
+    const {cellSize, cellSliceSize} = this;
+    const voxelX = THREE.MathUtils.euclideanModulo(x, cellSize) | 0;
+    const voxelY = THREE.MathUtils.euclideanModulo(y, cellSize) | 0;
+    const voxelZ = THREE.MathUtils.euclideanModulo(z, cellSize) | 0;
+    return voxelY * cellSliceSize +
+           voxelZ * cellSize +
+           voxelX;
+  }
  setVoxel(x, y, z, v) {
    const cell = this.getCellForVoxel(x, y, z);
    if (!cell) {
      return;  // TODO: add a new cell?
    }
-    const {cellSize} = this;
-    const voxelX = THREE.MathUtils.euclideanModulo(x, cellSize) | 0;
-    const voxelY = THREE.MathUtils.euclideanModulo(y, cellSize) | 0;
-    const voxelZ = THREE.MathUtils.euclideanModulo(z, cellSize) | 0;
-    const voxelOffset = voxelY * cellSize * cellSize +
-                        voxelZ * cellSize +
-                        voxelX;
+    const voxelOffset = this.computeVoxelOffset(x, y, z);
    cell[voxelOffset] = v;
  }
  getVoxel(x, y, z) {
    const cell = this.getCellForVoxel(x, y, z);
    if (!cell) {
      return 0;
    }
-    const {cellSize} = this;
-    const voxelX = THREE.MathUtils.euclideanModulo(x, cellSize) | 0;
-    const voxelY = THREE.MathUtils.euclideanModulo(y, cellSize) | 0;
-    const voxelZ = THREE.MathUtils.euclideanModulo(z, cellSize) | 0;
-    const voxelOffset = voxelY * cellSize * cellSize +
-                        voxelZ * cellSize +
-                        voxelX;
+    const voxelOffset = this.computeVoxelOffset(x, y, z);
    return cell[voxelOffset];
  }
  generateGeometryDataForCell(cellX, cellY, cellZ) {

  ...
}
</pre>
<p>Now let's make some code to fill out the first cell with voxels.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const cellSize = 32;

const world = new VoxelWorld(cellSize);

for (let y = 0; y &lt; cellSize; ++y) {
  for (let z = 0; z &lt; cellSize; ++z) {
    for (let x = 0; x &lt; cellSize; ++x) {
      const height = (Math.sin(x / cellSize * Math.PI * 2) + Math.sin(z / cellSize * Math.PI * 3)) * (cellSize / 6) + (cellSize / 2);
      if (y &lt; height) {
        world.setVoxel(x, y, z, 1);
      }
    }
  }
}
</pre>
<p>and some code to actually generate geometry like we covered in
<a href="custom-buffergeometry.html">the article on custom BufferGeometry</a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const {positions, normals, indices} = world.generateGeometryDataForCell(0, 0, 0);
const geometry = new THREE.BufferGeometry();
const material = new THREE.MeshLambertMaterial({color: 'green'});

const positionNumComponents = 3;
const normalNumComponents = 3;
geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
geometry.setAttribute(
    'normal',
    new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
geometry.setIndex(indices);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
</pre>
<p>let's try it</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/voxel-geometry-culled-faces.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/voxel-geometry-culled-faces.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>That seems to be working! Okay, let's add in textures.</p>
<p>Searching on the net I found <a href="https://www.minecraftforum.net/forums/mapping-and-modding-java-edition/resource-packs/1245961-16x-1-7-4-wip-flourish">this set</a>
of <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC-BY-NC-SA</a> licensed minecraft textures
by <a href="https://www.minecraftforum.net/members/Joshtimus">Joshtimus</a>.
I picked a few at random and built this <a href="https://www.google.com/search?q=texture+atlas">texture atlas</a>.</p>
<div class="threejs_center"><img class="checkerboard" src="../examples/resources/images/minecraft/flourish-cc-by-nc-sa.png" style="width: 512px; image-rendering: pixelated;"></div>

<p>To make things simple they are arranged a voxel type per column
where the top row is the side of a voxel. The 2nd row is
the top of voxel, and the 3rd row is the bottom of the voxel.</p>
<p>Knowing that we can add info to our <code class="notranslate" translate="no">VoxelWorld.faces</code> data
to specify for each face which row to use and the UVs to use
for that face.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">VoxelWorld.faces = [
  { // left
+    uvRow: 0,
    dir: [ -1,  0,  0, ],
    corners: [
-      [ 0, 1, 0 ],
-      [ 0, 0, 0 ],
-      [ 0, 1, 1 ],
-      [ 0, 0, 1 ],
+      { pos: [ 0, 1, 0 ], uv: [ 0, 1 ], },
+      { pos: [ 0, 0, 0 ], uv: [ 0, 0 ], },
+      { pos: [ 0, 1, 1 ], uv: [ 1, 1 ], },
+      { pos: [ 0, 0, 1 ], uv: [ 1, 0 ], },
    ],
  },
  { // right
+    uvRow: 0,
    dir: [  1,  0,  0, ],
    corners: [
-      [ 1, 1, 1 ],
-      [ 1, 0, 1 ],
-      [ 1, 1, 0 ],
-      [ 1, 0, 0 ],
+      { pos: [ 1, 1, 1 ], uv: [ 0, 1 ], },
+      { pos: [ 1, 0, 1 ], uv: [ 0, 0 ], },
+      { pos: [ 1, 1, 0 ], uv: [ 1, 1 ], },
+      { pos: [ 1, 0, 0 ], uv: [ 1, 0 ], },
    ],
  },
  { // bottom
+    uvRow: 1,
    dir: [  0, -1,  0, ],
    corners: [
-      [ 1, 0, 1 ],
-      [ 0, 0, 1 ],
-      [ 1, 0, 0 ],
-      [ 0, 0, 0 ],
+      { pos: [ 1, 0, 1 ], uv: [ 1, 0 ], },
+      { pos: [ 0, 0, 1 ], uv: [ 0, 0 ], },
+      { pos: [ 1, 0, 0 ], uv: [ 1, 1 ], },
+      { pos: [ 0, 0, 0 ], uv: [ 0, 1 ], },
    ],
  },
  { // top
+    uvRow: 2,
    dir: [  0,  1,  0, ],
    corners: [
-      [ 0, 1, 1 ],
-      [ 1, 1, 1 ],
-      [ 0, 1, 0 ],
-      [ 1, 1, 0 ],
+      { pos: [ 0, 1, 1 ], uv: [ 1, 1 ], },
+      { pos: [ 1, 1, 1 ], uv: [ 0, 1 ], },
+      { pos: [ 0, 1, 0 ], uv: [ 1, 0 ], },
+      { pos: [ 1, 1, 0 ], uv: [ 0, 0 ], },
    ],
  },
  { // back
+    uvRow: 0,
    dir: [  0,  0, -1, ],
    corners: [
-      [ 1, 0, 0 ],
-      [ 0, 0, 0 ],
-      [ 1, 1, 0 ],
-      [ 0, 1, 0 ],
+      { pos: [ 1, 0, 0 ], uv: [ 0, 0 ], },
+      { pos: [ 0, 0, 0 ], uv: [ 1, 0 ], },
+      { pos: [ 1, 1, 0 ], uv: [ 0, 1 ], },
+      { pos: [ 0, 1, 0 ], uv: [ 1, 1 ], },
    ],
  },
  { // front
+    uvRow: 0,
    dir: [  0,  0,  1, ],
    corners: [
-      [ 0, 0, 1 ],
-      [ 1, 0, 1 ],
-      [ 0, 1, 1 ],
-      [ 1, 1, 1 ],
+      { pos: [ 0, 0, 1 ], uv: [ 0, 0 ], },
+      { pos: [ 1, 0, 1 ], uv: [ 1, 0 ], },
+      { pos: [ 0, 1, 1 ], uv: [ 0, 1 ], },
+      { pos: [ 1, 1, 1 ], uv: [ 1, 1 ], },
    ],
  },
];
</pre>
<p>And we can update the code to use that data. We need to
know the size of a tile in the texture atlas and the dimensions
of the texture.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class VoxelWorld {
-  constructor(cellSize) {
-    this.cellSize = cellSize;
+  constructor(options) {
+    this.cellSize = options.cellSize;
+    this.tileSize = options.tileSize;
+    this.tileTextureWidth = options.tileTextureWidth;
+    this.tileTextureHeight = options.tileTextureHeight;
+    const {cellSize} = this;
+    this.cellSliceSize = cellSize * cellSize;
+    this.cell = new Uint8Array(cellSize * cellSize * cellSize);
  }

  ...

  generateGeometryDataForCell(cellX, cellY, cellZ) {
-    const {cellSize} = this;
+    const {cellSize, tileSize, tileTextureWidth, tileTextureHeight} = this;
    const positions = [];
    const normals = [];
+    const uvs = [];
    const indices = [];
    const startX = cellX * cellSize;
    const startY = cellY * cellSize;
    const startZ = cellZ * cellSize;

    for (let y = 0; y &lt; cellSize; ++y) {
      const voxelY = startY + y;
      for (let z = 0; z &lt; cellSize; ++z) {
        const voxelZ = startZ + z;
        for (let x = 0; x &lt; cellSize; ++x) {
          const voxelX = startX + x;
          const voxel = this.getVoxel(voxelX, voxelY, voxelZ);
          if (voxel) {
            const uvVoxel = voxel - 1;  // voxel 0 is sky so for UVs we start at 0
            // There is a voxel here but do we need faces for it?
-            for (const {dir, corners} of VoxelWorld.faces) {
+            for (const {dir, corners, uvRow} of VoxelWorld.faces) {
              const neighbor = this.getVoxel(
                  voxelX + dir[0],
                  voxelY + dir[1],
                  voxelZ + dir[2]);
              if (!neighbor) {
                // this voxel has no neighbor in this direction so we need a face.
                const ndx = positions.length / 3;
-                for (const pos of corners) {
+                for (const {pos, uv} of corners) {
                  positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
                  normals.push(...dir);
+                  uvs.push(
+                        (uvVoxel +   uv[0]) * tileSize / tileTextureWidth,
+                    1 - (uvRow + 1 - uv[1]) * tileSize / tileTextureHeight);
                }
                indices.push(
                  ndx, ndx + 1, ndx + 2,
                  ndx + 2, ndx + 1, ndx + 3,
                );
              }
            }
          }
        }
      }
    }

    return {
      positions,
      normals,
      uvs,
      indices,
    };
  }
}
</pre>
<p>We then need to <a href="textures.html">load the texture</a></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const loader = new THREE.TextureLoader();
const texture = loader.load('resources/images/minecraft/flourish-cc-by-nc-sa.png', render);
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestFilter;
texture.colorSpace = THREE.SRGBColorSpace;
</pre>
<p>and pass the settings to the <code class="notranslate" translate="no">VoxelWorld</code> class</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const tileSize = 16;
+const tileTextureWidth = 256;
+const tileTextureHeight = 64;
-const world = new VoxelWorld(cellSize);
+const world = new VoxelWorld({
+  cellSize,
+  tileSize,
+  tileTextureWidth,
+  tileTextureHeight,
+});
</pre>
<p>Let's actually use the UVs when we create the geometry
and the texture when we make the material</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-const {positions, normals, indices} = world.generateGeometryDataForCell(0, 0, 0);
+const {positions, normals, uvs, indices} = world.generateGeometryDataForCell(0, 0, 0);
const geometry = new THREE.BufferGeometry();
-const material = new THREE.MeshLambertMaterial({color: 'green'});
+const material = new THREE.MeshLambertMaterial({
+  map: texture,
+  side: THREE.DoubleSide,
+  alphaTest: 0.1,
+  transparent: true,
+});

const positionNumComponents = 3;
const normalNumComponents = 3;
+const uvNumComponents = 2;
geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
geometry.setAttribute(
    'normal',
    new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
+geometry.setAttribute(
+    'uv',
+    new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
geometry.setIndex(indices);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
</pre>
<p>One last thing, we actually need to set some voxels
to use different textures.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">for (let y = 0; y &lt; cellSize; ++y) {
  for (let z = 0; z &lt; cellSize; ++z) {
    for (let x = 0; x &lt; cellSize; ++x) {
      const height = (Math.sin(x / cellSize * Math.PI * 2) + Math.sin(z / cellSize * Math.PI * 3)) * (cellSize / 6) + (cellSize / 2);
      if (y &lt; height) {
-        world.setVoxel(x, y, z, 1);
+        world.setVoxel(x, y, z, randInt(1, 17));
      }
    }
  }
}

+function randInt(min, max) {
+  return Math.floor(Math.random() * (max - min) + min);
+}
</pre>
<p>and with that we get textures!</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/voxel-geometry-culled-faces-with-textures.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/voxel-geometry-culled-faces-with-textures.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Let's make it support more than one cell.</p>
<p>To do this lets store cells in an object using cell ids.
A cell id will just be a cell's coordinates separated by
a comma. In other words if we ask for voxel 35,0,0
that is in cell 1,0,0 so its id is <code class="notranslate" translate="no">"1,0,0"</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class VoxelWorld {
  constructor(options) {
    this.cellSize = options.cellSize;
    this.tileSize = options.tileSize;
    this.tileTextureWidth = options.tileTextureWidth;
    this.tileTextureHeight = options.tileTextureHeight;
    const {cellSize} = this;
    this.cellSliceSize = cellSize * cellSize;
-    this.cell = new Uint8Array(cellSize * cellSize * cellSize);
+    this.cells = {};
  }
+  computeCellId(x, y, z) {
+    const {cellSize} = this;
+    const cellX = Math.floor(x / cellSize);
+    const cellY = Math.floor(y / cellSize);
+    const cellZ = Math.floor(z / cellSize);
+    return `${cellX},${cellY},${cellZ}`;
+  }
+  getCellForVoxel(x, y, z) {
-    const cellX = Math.floor(x / cellSize);
-    const cellY = Math.floor(y / cellSize);
-    const cellZ = Math.floor(z / cellSize);
-    if (cellX !== 0 || cellY !== 0 || cellZ !== 0) {
-      return null;
-    }
-    return this.cell;
+    return this.cells[this.computeCellId(x, y, z)];
  }

   ...
}
</pre>
<p>and now we can make <code class="notranslate" translate="no">setVoxel</code> add new cells if
we try to set a voxel in a cell that does not yet exist</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">  setVoxel(x, y, z, v) {
-    const cell = this.getCellForVoxel(x, y, z);
+    let cell = this.getCellForVoxel(x, y, z);
    if (!cell) {
-      return 0;
+      cell = this.addCellForVoxel(x, y, z);
    }
    const voxelOffset = this.computeVoxelOffset(x, y, z);
    cell[voxelOffset] = v;
  }
+  addCellForVoxel(x, y, z) {
+    const cellId = this.computeCellId(x, y, z);
+    let cell = this.cells[cellId];
+    if (!cell) {
+      const {cellSize} = this;
+      cell = new Uint8Array(cellSize * cellSize * cellSize);
+      this.cells[cellId] = cell;
+    }
+    return cell;
+  }
</pre>
<p>Let's make this editable.</p>
<p>First we`ll add a UI. Using radio buttons we can make an 8x2
array of tiles</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;body&gt;
  &lt;canvas id="c"&gt;&lt;/canvas&gt;
+  &lt;div id="ui"&gt;
+    &lt;div class="tiles"&gt;
+      &lt;input type="radio" name="voxel" id="voxel1" value="1"&gt;&lt;label for="voxel1" style="background-position:   -0% -0%"&gt;&lt;/label&gt;
+      &lt;input type="radio" name="voxel" id="voxel2" value="2"&gt;&lt;label for="voxel2" style="background-position: -100% -0%"&gt;&lt;/label&gt;
+      &lt;input type="radio" name="voxel" id="voxel3" value="3"&gt;&lt;label for="voxel3" style="background-position: -200% -0%"&gt;&lt;/label&gt;
+      &lt;input type="radio" name="voxel" id="voxel4" value="4"&gt;&lt;label for="voxel4" style="background-position: -300% -0%"&gt;&lt;/label&gt;
+      &lt;input type="radio" name="voxel" id="voxel5" value="5"&gt;&lt;label for="voxel5" style="background-position: -400% -0%"&gt;&lt;/label&gt;
+      &lt;input type="radio" name="voxel" id="voxel6" value="6"&gt;&lt;label for="voxel6" style="background-position: -500% -0%"&gt;&lt;/label&gt;
+      &lt;input type="radio" name="voxel" id="voxel7" value="7"&gt;&lt;label for="voxel7" style="background-position: -600% -0%"&gt;&lt;/label&gt;
+      &lt;input type="radio" name="voxel" id="voxel8" value="8"&gt;&lt;label for="voxel8" style="background-position: -700% -0%"&gt;&lt;/label&gt;
+    &lt;/div&gt;
+    &lt;div class="tiles"&gt;
+      &lt;input type="radio" name="voxel" id="voxel9"  value="9" &gt;&lt;label for="voxel9"  style="background-position:  -800% -0%"&gt;&lt;/label&gt;
+      &lt;input type="radio" name="voxel" id="voxel10" value="10"&gt;&lt;label for="voxel10" style="background-position:  -900% -0%"&gt;&lt;/label&gt;
+      &lt;input type="radio" name="voxel" id="voxel11" value="11"&gt;&lt;label for="voxel11" style="background-position: -1000% -0%"&gt;&lt;/label&gt;
+      &lt;input type="radio" name="voxel" id="voxel12" value="12"&gt;&lt;label for="voxel12" style="background-position: -1100% -0%"&gt;&lt;/label&gt;
+      &lt;input type="radio" name="voxel" id="voxel13" value="13"&gt;&lt;label for="voxel13" style="background-position: -1200% -0%"&gt;&lt;/label&gt;
+      &lt;input type="radio" name="voxel" id="voxel14" value="14"&gt;&lt;label for="voxel14" style="background-position: -1300% -0%"&gt;&lt;/label&gt;
+      &lt;input type="radio" name="voxel" id="voxel15" value="15"&gt;&lt;label for="voxel15" style="background-position: -1400% -0%"&gt;&lt;/label&gt;
+      &lt;input type="radio" name="voxel" id="voxel16" value="16"&gt;&lt;label for="voxel16" style="background-position: -1500% -0%"&gt;&lt;/label&gt;
+    &lt;/div&gt;
+  &lt;/div&gt;
&lt;/body&gt;
</pre>
<p>And add some CSS to style it, display the tiles and highlight
the current selection</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">body {
    margin: 0;
}
#c {
    width: 100%;
    height: 100%;
    display: block;
}
+#ui {
+    position: absolute;
+    left: 10px;
+    top: 10px;
+    background: rgba(0, 0, 0, 0.8);
+    padding: 5px;
+}
+#ui input[type=radio] {
+  width: 0;
+  height: 0;
+  display: none;
+}
+#ui input[type=radio] + label {
+  background-image: url('resources/images/minecraft/flourish-cc-by-nc-sa.png');
+  background-size: 1600% 400%;
+  image-rendering: pixelated;
+  width: 64px;
+  height: 64px;
+  display: inline-block;
+}
+#ui input[type=radio]:checked + label {
+  outline: 3px solid red;
+}
+@media (max-width: 600px), (max-height: 600px) {
+  #ui input[type=radio] + label {
+    width: 32px;
+    height: 32px;
+  }
+}
</pre>
<p>The UX will be as follows. If no tile is selected and you click a voxel that
voxel will be erased or if you click a voxel and are holding the shift key it
will be erased. Otherwise if a tiles is selected it will be added. You can
deselect the selected tile type by clicking it again.</p>
<p>This code will let the user unselect the highlighted
radio button.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">let currentVoxel = 0;
let currentId;

document.querySelectorAll('#ui .tiles input[type=radio][name=voxel]').forEach((elem) =&gt; {
  elem.addEventListener('click', allowUncheck);
});

function allowUncheck() {
  if (this.id === currentId) {
    this.checked = false;
    currentId = undefined;
    currentVoxel = 0;
  } else {
    currentId = this.id;
    currentVoxel = parseInt(this.value);
  }
}
</pre>
<p>And this below code will let us set a voxel based on where
the user clicks. It uses code similar to the code we
made in <a href="picking.html">the article on picking</a>
but it's not using the built in <code class="notranslate" translate="no">RayCaster</code>. Instead
it's using <code class="notranslate" translate="no">VoxelWorld.intersectRay</code> which returns
the position of intersection and the normal of the face
hit.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
  };
}

function placeVoxel(event) {
  const pos = getCanvasRelativePosition(event);
  const x = (pos.x / canvas.width ) *  2 - 1;
  const y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y

  const start = new THREE.Vector3();
  const end = new THREE.Vector3();
  start.setFromMatrixPosition(camera.matrixWorld);
  end.set(x, y, 1).unproject(camera);

  const intersection = world.intersectRay(start, end);
  if (intersection) {
    const voxelId = event.shiftKey ? 0 : currentVoxel;
    // the intersection point is on the face. That means
    // the math imprecision could put us on either side of the face.
    // so go half a normal into the voxel if removing (currentVoxel = 0)
    // our out of the voxel if adding (currentVoxel  &gt; 0)
    const pos = intersection.position.map((v, ndx) =&gt; {
      return v + intersection.normal[ndx] * (voxelId &gt; 0 ? 0.5 : -0.5);
    });
    world.setVoxel(...pos, voxelId);
    updateVoxelGeometry(...pos);
    requestRenderIfNotRequested();
  }
}

const mouse = {
  x: 0,
  y: 0,
};

function recordStartPosition(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouse.moveX = 0;
  mouse.moveY = 0;
}
function recordMovement(event) {
  mouse.moveX += Math.abs(mouse.x - event.clientX);
  mouse.moveY += Math.abs(mouse.y - event.clientY);
}
function placeVoxelIfNoMovement(event) {
  if (mouse.moveX &lt; 5 &amp;&amp; mouse.moveY &lt; 5) {
    placeVoxel(event);
  }
  window.removeEventListener('pointermove', recordMovement);
  window.removeEventListener('pointerup', placeVoxelIfNoMovement);
}
canvas.addEventListener('pointerdown', (event) =&gt; {
  event.preventDefault();
  recordStartPosition(event);
  window.addEventListener('pointermove', recordMovement);
  window.addEventListener('pointerup', placeVoxelIfNoMovement);
}, {passive: false});
canvas.addEventListener('touchstart', (event) =&gt; {
  // stop scrolling
  event.preventDefault();
}, {passive: false});
</pre>
<p>There's a lot going on in the code above. Basically the mouse
has a dual purpose. One is to move the camera. The other is to
edit the world. Placing/Erasing a voxel happen when you let off the mouse
but only if you have not moved the mouse since you first pressed down.
This is just a guess that if you did move the mouse you were trying
to move the camera, not place a block. <code class="notranslate" translate="no">moveX</code> and <code class="notranslate" translate="no">moveY</code> are
in absolute movement so if you move to the left 10 and then back to
the right 10 you'll have moved 20 units. In that case the user likely
was just rotating the model back and forth and does not want to
place a block. I didn't do any testing to see if <code class="notranslate" translate="no">5</code> is a good range or not. </p>
<p>In the code we call <code class="notranslate" translate="no">world.setVoxel</code> to set a voxel and
then <code class="notranslate" translate="no">updateVoxelGeometry</code> to update the three.js geometry
based on what's changed.</p>
<p>Let's make that now. If the user clicks a
voxel on the edge of a cell then the geometry for the voxel
in the adjacent cell might need new geometry. This means
we need to check the cell for the voxel we just edited
as well as in all 6 directions from that cell.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const neighborOffsets = [
  [ 0,  0,  0], // self
  [-1,  0,  0], // left
  [ 1,  0,  0], // right
  [ 0, -1,  0], // down
  [ 0,  1,  0], // up
  [ 0,  0, -1], // back
  [ 0,  0,  1], // front
];
function updateVoxelGeometry(x, y, z) {
  const updatedCellIds = {};
  for (const offset of neighborOffsets) {
    const ox = x + offset[0];
    const oy = y + offset[1];
    const oz = z + offset[2];
    const cellId = world.computeCellId(ox, oy, oz);
    if (!updatedCellIds[cellId]) {
      updatedCellIds[cellId] = true;
      updateCellGeometry(ox, oy, oz);
    }
  }
}
</pre>
<p>I thought about checking for adjacent cells like </p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const voxelX = THREE.MathUtils.euclideanModulo(x, cellSize) | 0;
if (voxelX === 0) {
  // update cell to the left
} else if (voxelX === cellSize - 1) {
  // update cell to the right
}
</pre>
<p>and there would be 4 more checks for the other 4 directions
but it occurred to me the code would be much simpler with
just an array of offsets and saving off the cell ids of
the cells we already updated. If the updated voxel is not
on the edge of a cell then the test will quickly reject updating
the same cell.</p>
<p>For <code class="notranslate" translate="no">updateCellGeometry</code> we're just going to take the code we
had before that was generating the geometry for one cell
and make it handle multiple cells.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const cellIdToMesh = {};
function updateCellGeometry(x, y, z) {
  const cellX = Math.floor(x / cellSize);
  const cellY = Math.floor(y / cellSize);
  const cellZ = Math.floor(z / cellSize);
  const cellId = world.computeCellId(x, y, z);
  let mesh = cellIdToMesh[cellId];
  const geometry = mesh ? mesh.geometry : new THREE.BufferGeometry();

  const {positions, normals, uvs, indices} = world.generateGeometryDataForCell(cellX, cellY, cellZ);
  const positionNumComponents = 3;
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
  const normalNumComponents = 3;
  geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
  const uvNumComponents = 2;
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();

  if (!mesh) {
    mesh = new THREE.Mesh(geometry, material);
    mesh.name = cellId;
    cellIdToMesh[cellId] = mesh;
    scene.add(mesh);
    mesh.position.set(cellX * cellSize, cellY * cellSize, cellZ * cellSize);
  }
}
</pre>
<p>The code above checks a map of cell ids to meshes. If
we ask for a cell that doesn't exist a new <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> is made
and added to the correct place in world space.
At the end we update the attributes and indices with the new data.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/voxel-geometry-culled-faces-ui.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/voxel-geometry-culled-faces-ui.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Some notes:</p>
<p><code class="notranslate" translate="no">RayCaster</code> might have worked just fine. I didn't try it.
Instead I found <a href="https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.42.3443&rep=rep1&type=pdf">a voxel specific raycaster</a>.
that is optimized for voxels.</p>
<p>I made <code class="notranslate" translate="no">intersectRay</code> part of VoxelWorld because it seemed
like if it gets too slow we could raycast against cells
before raycasting on voxels as a simple speed up if it becomes
too slow.</p>
<p>You might want to change the length of the raycast
as currently it's all the way to Z-far. I expect if the
user clicks something too far way they don't really want
to be placing blocks on the other side of the world that
are 1 or 2 pixel large.</p>
<p>Calling <code class="notranslate" translate="no">geometry.computeBoundingSphere</code> might be slow.
We could just manually set the bounding sphere to the fit
the entire cell.</p>
<p>Do we want remove cells if all voxels in that cell are 0?
That would probably be reasonable change if we wanted to ship this.</p>
<p>Thinking about how this works it's clear the absolute
worst case is a checkerboard of on and off voxels. I don't
know off the top of my head what other strategies to use
if things get too slow. Maybe getting too slow would just
encourage the user not to make giant checkerboard areas.</p>
<p>To keep it simple the texture atlas is just 1 column
per voxel type. It would be better to make something more
flexible where we have a table of voxel types and each
type can specify where its face textures are in the atlas.
As it is lots of space is wasted.</p>
<p>Looking at real minecraft there are tiles that are not
voxels, not cubes. Like a fence tile or flowers. To do that
we'd again need some table of voxel types and for each
voxel whether it's a cube or some other geometry. If it's
not a cube the neighbor check when generating the geometry
would also need to change. A flower voxel next to another
voxel should not remove the faces between them.</p>
<p>If you want to make some minecraft like thing using three.js
I hope this has given you some ideas where to start and how
to generate some what efficient geometry.</p>
<p><canvas id="c"></canvas></p>
<script type="module" src="../resources/threejs-voxel-geometry.js"></script>


        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>


# webxr-basics.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>VR</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – VR">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>VR</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p>Making a VR app in three.js is pretty simple. You basically just have to tell
three.js you want to use WebXR. If you think about it a few things about WebXR
should be clear. Which way the camera is pointing is supplied by the VR system
itself since the user turns their head to choose a direction to look. Similarly
the field of view and aspect will be supplied by the VR system since each system
has a different field of view and display aspect.</p>
<p>Let's take an example from the article on <a href="responsive.html">making a responsive webpage</a>
and make it support VR.</p>
<p>Before we get started you're going to need a VR capable device like an Android
smartphone, Google Daydream, Oculus Go, Oculus Rift, Vive, Samsung Gear VR., an
iPhone with a <a href="https://apps.apple.com/us/app/webxr-viewer/id1295998056">WebXR browser</a>.</p>
<p>Next, if you are running locally you need to run a simple web server like is
covered in <a href="setup.html">the article on setting up</a>. </p>
<p>If the device you are using to view VR is not the same computer you're running
on you need to serve your webpage via https or else the browser will not allow using
the WebXR API. The server mentioned in <a href="setup.html">the article on setting up</a>
called <a href="https://greggman.github.io/servez">Servez</a> has an option to use https.
Check it and start the server. </p>
<div class="threejs_center"><img src="../resources/images/servez-https.png" class="nobg" style="width: 912px;"></div>

<p>The note the URLs. You need the one that is your computer's local ipaddress.
It will usually start with <code class="notranslate" translate="no">192</code>, <code class="notranslate" translate="no">172</code> or <code class="notranslate" translate="no">10</code>. Type that full address, including the <code class="notranslate" translate="no">https://</code> part
into your VR device's browser. Note: Your computer and your VR device need to be on the same local network
or WiFi and you probably need to be on a home network. note: Many cafes are setup to disallow this kind of
machine to machine connection.</p>
<p>You'll be greeted with an error something like the one below. Click "advanced" and then click
<em>proceed</em>.</p>
<div class="threejs_center"><img src="../resources/images/https-warning.gif"></div>

<p>Now you can run your examples.</p>
<p>If you're really going to do WebXR development another thing you should learn about is
<a href="https://developers.google.com/web/tools/chrome-devtools/remote-debugging/">remote debugging</a>
so that you can see console warnings, errors, and of course actually
<a href="debugging-javascript.html">debug your code</a>.</p>
<p>If you just want to see the code work below you can just run the code from
this site.</p>
<p>The first thing we need to do is include the VR support after
including three.js</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">import * as THREE from 'three';
+import {VRButton} from 'three/addons/webxr/VRButton.js';
</pre>
<p>Then we need to enable three.js's WebXR support and add its
VR button to our page</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
+  renderer.xr.enabled = true;
+  document.body.appendChild(VRButton.createButton(renderer));
</pre>
<p>We need to let three.js run our render loop. Until now we have used a
<code class="notranslate" translate="no">requestAnimationFrame</code> loop but to support VR we need to let three.js handle
our render loop for us. We can do that by calling
<a href="/docs/#api/en/renderers/WebGLRenderer.setAnimationLoop"><code class="notranslate" translate="no">WebGLRenderer.setAnimationLoop</code></a> and passing a function to call for the loop.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {
  time *= 0.001;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  cubes.forEach((cube, ndx) =&gt; {
    const speed = 1 + ndx * .1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });

  renderer.render(scene, camera);

-  requestAnimationFrame(render);
}

-requestAnimationFrame(render);
+renderer.setAnimationLoop(render);
</pre>
<p>There is one more detail. We should probably set a camera height
that's kind of average for a standing user.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
+camera.position.set(0, 1.6, 0);
</pre>
<p>and move the cubes up to be in front of the camera</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

cube.position.x = x;
+cube.position.y = 1.6;
+cube.position.z = -2;
</pre>
<p>We set them to <code class="notranslate" translate="no">z = -2</code> since the camera will now be at <code class="notranslate" translate="no">z = 0</code> and
camera defaults to looking down the -z axis.</p>
<p>This brings up an extremely important point. <strong>Units in VR are in meters</strong>.
In other words <strong>One Unit = One Meter</strong>. This means the camera is 1.6 meters above 0.
The cube's centers are 2 meters in front of the camera. Each cube
is 1x1x1 meter large. This is important because VR needs to adjust things to the
user <em>in the real world</em>. That means we need the units used in three.js to match
the user's own movements.</p>
<p>And with that we should get 3 spinning cubes in front
of the camera with a button to enter VR.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/webxr-basic.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/webxr-basic.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>I find that VR works better if we have something surrounding the camera like
room for reference so let's add a simple grid cubemap like we covered in
<a href="backgrounds.html">the article on backgrounds</a>. We'll just use the same grid
texture for each side of the cube which will give as a grid room.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const scene = new THREE.Scene();
+{
+  const loader = new THREE.CubeTextureLoader();
+  const texture = loader.load([
+    'resources/images/grid-1024.png',
+    'resources/images/grid-1024.png',
+    'resources/images/grid-1024.png',
+    'resources/images/grid-1024.png',
+    'resources/images/grid-1024.png',
+    'resources/images/grid-1024.png',
+  ]);
+  scene.background = texture;
+}
</pre>
<p>That's better.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/webxr-basic-w-background.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/webxr-basic-w-background.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Note: To actually see VR you will need a WebXR compatible device.
I believe most Android Phones can support WebXR using Chrome or Firefox.
For iOS you might be able to use this <a href="https://apps.apple.com/us/app/webxr-viewer/id1295998056">WebXR App</a>
though in general WebXR support on iOS is unsupported as of May 2019.</p>
<p>To use WebXR on Android or iPhone you'll need a <em>VR Headset</em>
for phones. You can get them for anywhere from $5 for one made of cardboard
to $100. Unfortunately I don't know which ones to recommend. I've purchased
6 of them over the years and they are all of varying quality. I've
never paid more than about $25.</p>
<p>Just to mention some of the issues</p>
<ol>
<li><p>Do they fit your phone</p>
<p>Phones come in a variety of sizes and so the VR headsets need to match.
Many headsets claim to match a large variety of sizes. My experience
is the more sizes they match the worse they actually are since instead
of being designed for a specific size they have to make compromises
to match more sizes. Unfortunately multi-size headsets are the most common type.</p>
</li>
<li><p>Can they focus for your face</p>
<p>Some devices have more adjustments than others. Generally there
are at most 2 adjustments. How far the lenses are from your eyes
and how far apart the lenses are.</p>
</li>
<li><p>Are they too reflective</p>
<p>Many headsets of a cone of plastic from your eye to the phone.
If that plastic is shinny or reflective then it will act like
a mirror reflecting the screen and be very distracting.</p>
<p>Few if any of the reviews seem to cover this issue.</p>
</li>
<li><p>Are the comfortable on your face.</p>
<p>Most of the devices rest on your nose like a pair of glasses.
That can hurt after a few minutes. Some have straps that go around
your head. Others have a 3rd strap that goes over your head. These
may or may not help keep the device at the right place.</p>
<p>It turns out for most (all?) devices, you eyes need to be centered
with the lenses. If the lenses are slightly above or below your
eyes the image gets out of focus. This can be very frustrating
as things might start in focus but 45-60 seconds later the device
has shifted up or down 1 millimeter and you suddenly realize you've
been struggling to focus on a blurry image.</p>
</li>
<li><p>Can they support your glasses.</p>
<p>If you wear eye glasses then you'll need to read the reviews to see
if a particular headset works well with eye glasses.</p>
</li>
</ol>
<p>I really can't make any recommendations unfortunately. <a href="https://vr.google.com/cardboard/get-cardboard/">Google has some
cheap recommendations made from cardboard</a>
some of them as low as $5 so maybe start there and if you enjoy it
then consider upgrading. $5 is like the price of 1 coffee so seriously, give it try!</p>
<p>There are also 3 basic types of devices.</p>
<ol>
<li><p>3 degrees of freedom (3dof), no input device</p>
<p>This is generally the phone style although sometimes you can
buy a 3rd party input device. The 3 degrees of freedom
mean you can look up/down (1), left/right(2) and you can tilt
your head left and right (3).</p>
</li>
<li><p>3 degrees of freedom (3dof) with 1 input device (3dof)</p>
<p>This is basically Google Daydream and Oculus GO</p>
<p>These also allow 3 degrees of freedom and include a small
controller that acts like a laser pointer inside VR.
The laser pointer also only has 3 degrees of freedom. The
system can tell which way the input device is pointing but
it can not tell where the device is.</p>
</li>
<li><p>6 degrees of freedom (6dof) with input devices (6dof)</p>
<p>These are <em>the real deal</em> haha. 6 degrees of freedom
means not only do these device know which way you are looking
but they also know where your head actually is. That means
if you move from left to right or forward and back or stand up / sit down
the devices can register this and everything in VR moves accordingly.
It's spookily and amazingly real feeling. With a good demo
you'll be blown away or at least I was and still am.</p>
<p>Further these devices usually include 2 controllers, one
for each hand and the system can tell exactly where your
hands are and which way they are oriented and so you can
manipulate things in VR by just reaching out, touching,
pushing, twisting, etc...</p>
<p>6 degree of freedom devices include the Vive and Vive Pro,
the Oculus Rift and Quest, and I believe all of the Windows MR devices.</p>
</li>
</ol>
<p>With all that covered I don't for sure know which devices will work with WebXR.
I'm 99% sure that most Android phones will work when running Chrome. You may
need to turn on WebXR support in <a href="about:flags"><code class="notranslate" translate="no">about:flags</code></a>. I also know Google
Daydream will also work and similarly you need to enable WebXR support in
<a href="about:flags"><code class="notranslate" translate="no">about:flags</code></a>. Oculus Rift, Vive, and Vive Pro will work via
Chrome or Firefox. I'm less sure about Oculus Go and Oculus Quest as both of
them use custom OSes but according to the internet they both appear to work.</p>
<p>Okay, after that long detour about VR Devices and WebXR
there's some things to cover</p>
<ul>
<li><p>Supporting both VR and Non-VR</p>
<p>AFAICT, at least as of r112, there is no easy way to support
both VR and non-VR modes with three.js. Ideally
if not in VR mode you'd be able to control the camera using
whatever means you want, for example the <a href="/docs/#examples/controls/OrbitControls"><code class="notranslate" translate="no">OrbitControls</code></a>,
and you'd get some kind of event when switching into and
out of VR mode so that you could turn the controls on/off.</p>
</li>
</ul>
<p>If three.js adds some support to do both I'll try to update
this article. Until then you might need 2 versions of your
site OR pass in a flag in the URL, something like</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">https://mysite.com/mycooldemo?allowvr=true
</pre><p>Then we could add some links in to switch modes</p>
<pre class="prettyprint showlinemods notranslate lang-html" translate="no">&lt;body&gt;
  &lt;canvas id="c"&gt;&lt;/canvas&gt;
+  &lt;div class="mode"&gt;
+    &lt;a href="?allowvr=true" id="vr"&gt;Allow VR&lt;/a&gt;
+    &lt;a href="?" id="nonvr"&gt;Use Non-VR Mode&lt;/a&gt;
+  &lt;/div&gt;
&lt;/body&gt;
</pre>
<p>and some CSS to position them</p>
<pre class="prettyprint showlinemods notranslate lang-css" translate="no">body {
    margin: 0;
}
#c {
    width: 100%;
    height: 100%;
    display: block;
}
+.mode {
+  position: absolute;
+  right: 1em;
+  top: 1em;
+}
</pre>
<p>in your code you could use that parameter like this</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
-  renderer.xr.enabled = true;
-  document.body.appendChild(VRButton.createButton(renderer));

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 1.6, 0);

+  const params = (new URL(document.location)).searchParams;
+  const allowvr = params.get('allowvr') === 'true';
+  if (allowvr) {
+    renderer.xr.enabled = true;
+    document.body.appendChild(VRButton.createButton(renderer));
+    document.querySelector('#vr').style.display = 'none';
+  } else {
+    // no VR, add some controls
+    const controls = new OrbitControls(camera, canvas);
+    controls.target.set(0, 1.6, -2);
+    controls.update();
+    document.querySelector('#nonvr').style.display = 'none';
+  }
</pre>
<p>Whether that's good or bad I don't know. I have a feeling the differences
between what's needed for VR and what's needed for non-VR are often
very different so for all but the most simple things maybe 2 separate pages
are better? You'll have to decide.</p>
<p>Note for various reasons this will not work in the live editor
on this site so if you want to check it out
<a href="../examples/webxr-basic-vr-optional.html" target="_blank">click here</a>.
It should start in non-VR mode and you can use the mouse or fingers to move
the camera. Clicking "Allow VR" should switch to allow VR mode and you should
be able to click "Enter VR" if you're on a VR device.</p>
<ul>
<li><p>Deciding on the level of VR support</p>
<p>Above we covered 3 types of VR devices. </p>
<ul>
<li>3DOF no input</li>
<li>3DOF + 3DOF input</li>
<li>6DOF + 6DOF input</li>
</ul>
<p>You need to decide how much effort you're willing to put in
to support each type of device.</p>
<p>For example the simplest device has no input. The best you can
generally do is make it so there are some buttons or objects in the user's view
and if the user aligns some marker in the center of the display
on those objects for 1/2 a second or so then that button is clicked.
A common UX is to display a small timer that will appear over the object indicating
if you keep the marker there for a moment the object/button will be selected.</p>
<p>Since there is no other input that's about the best you can do</p>
<p>The next level up you have one 3DOF input device. Generally it
can point at things and the user has at least 2 buttons. The Daydream
also has a touchpad which provides normal touch inputs.</p>
<p>In any case if a user has this type of device it's far more
comfortable for the user to by able to point at things with
their controller than it is to make them do it with their
head by looking at things.</p>
<p>A similar level to that might be 3DOF or 6DOF device with a
game console controller. You'll have to decide what to do here.
I suspect the most common thing is the user still has to look
to point and the controller is just used for buttons.</p>
<p>The last level is a user with a 6DOF headset and 2 6DOF controllers.
Those users will find an experience that is only 3DOF to often
be frustrating. Similarly they usually expect to be able to
virtually manipulate things with their hands in VR so you'll
have to decide if you want to support that or not.</p>
</li>
</ul>
<p>As you can see getting started in VR is pretty easy but
actually making something shippable in VR will require
lots of decision making and design.</p>
<p>This was a pretty brief intro into VR with three.js. We'll
cover some of the input methods in <a href="webxr-look-to-select.html">future articles</a>.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>


# webxr-look-to-select.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>VR - Look to Select</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – VR - Look to Select">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>VR - Look to Select</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p><strong>NOTE: The examples on this page require a VR capable
device. Without one they won't work. See <a href="webxr.html">previous article</a>
as to why</strong></p>
<p>In the <a href="webxr.html">previous article</a> we went over
a very simple VR example using three.js and we discussed
the various kinds of VR systems.</p>
<p>The simplest and possibly most common is the Google Cardboard style of VR which
is basically a phone put into a $5 - $50 face mask. This kind of VR has no
controller so people have to come up with creative solutions for allowing user
input.</p>
<p>The most common solution is "look to select" where if the
user points their head at something for a moment it gets
selected.</p>
<p>Let's implement "look to select"! We'll start with
<a href="webxr.html">an example from the previous article</a>
and to do it we'll add the <code class="notranslate" translate="no">PickHelper</code> we made in
<a href="picking.html">the article on picking</a>. Here it is.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(normalizedPosition, scene, camera, time) {
    // restore the color if there is a picked object
    if (this.pickedObject) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }

    // cast a ray through the frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      this.pickedObject = intersectedObjects[0].object;
      // save its color
      this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
      // set its emissive color to flashing red/yellow
      this.pickedObject.material.emissive.setHex((time * 8) % 2 &gt; 1 ? 0xFFFF00 : 0xFF0000);
    }
  }
}
</pre>
<p>For an explanation of that code <a href="picking.html">see the article on picking</a>.</p>
<p>To use it we just need to create an instance and call it in our render loop</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const pickHelper = new PickHelper();

...
function render(time) {
  time *= 0.001;

  ...

+  // 0, 0 is the center of the view in normalized coordinates.
+  pickHelper.pick({x: 0, y: 0}, scene, camera, time);
</pre>
<p>In the original picking example we converted the mouse coordinates
from CSS pixels into normalized coordinates that go from -1 to +1
across the canvas.</p>
<p>In this case though we will always pick where the camera is
facing which is the center of the screen so we pass in <code class="notranslate" translate="no">0</code> for
both <code class="notranslate" translate="no">x</code> and <code class="notranslate" translate="no">y</code> which is the center in normalized coordinates.</p>
<p>And with that objects will flash when we look at them</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/webxr-look-to-select.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/webxr-look-to-select.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>Typically we don't want selection to be immediate. Instead we require the user
to keep the camera on the thing they want to select for a few moments to give them
a chance not to select something by accident.</p>
<p>To do that we need some kind of meter or gauge or some way
to convey that the user must keep looking and for how long.</p>
<p>One easy way we could do that is to make a 2 color texture
and use a texture offset to slide the texture across a model.</p>
<p>Let's do this by itself to see it work before we add it to
the VR example.</p>
<p>First we make an <a href="/docs/#api/en/cameras/OrthographicCamera"><code class="notranslate" translate="no">OrthographicCamera</code></a></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const left = -2;    // Use values for left
const right = 2;    // right, top and bottom
const top = 1;      // that match the default
const bottom = -1;  // canvas size.
const near = -1;
const far = 1;
const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
</pre>
<p>And of course update it if the canvas changes size</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {
  time *= 0.001;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    const aspect = canvas.clientWidth / canvas.clientHeight;
+    camera.left = -aspect;
+    camera.right = aspect;
    camera.updateProjectionMatrix();
  }
  ...
</pre>
<p>We now have a camera that shows 2 units above and below the center and aspect units
left and right.</p>
<p>Next let's make a 2 color texture. We'll use a <a href="/docs/#api/en/textures/DataTexture"><code class="notranslate" translate="no">DataTexture</code></a>
which we've used a few <a href="indexed-textures.html">other</a>
<a href="post-processing-3dlut.html">places</a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function makeDataTexture(data, width, height) {
  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

const cursorColors = new Uint8Array([
  64, 64, 64, 64,       // dark gray
  255, 255, 255, 255,   // white
]);
const cursorTexture = makeDataTexture(cursorColors, 2, 1);
</pre>
<p>We'll then use that texture on a <a href="/docs/#api/en/geometries/TorusGeometry"><code class="notranslate" translate="no">TorusGeometry</code></a></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const ringRadius = 0.4;
const tubeRadius = 0.1;
const tubeSegments = 4;
const ringSegments = 64;
const cursorGeometry = new THREE.TorusGeometry(
    ringRadius, tubeRadius, tubeSegments, ringSegments);

const cursorMaterial = new THREE.MeshBasicMaterial({
  color: 'white',
  map: cursorTexture,
  transparent: true,
  blending: THREE.CustomBlending,
  blendSrc: THREE.OneMinusDstColorFactor,
  blendDst: THREE.OneMinusSrcColorFactor,
});
const cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
scene.add(cursor);
</pre>
<p>and then in <code class="notranslate" translate="no">render</code> lets adjust the texture's offset</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {
  time *= 0.001;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    camera.left = -aspect;
    camera.right = aspect;
    camera.updateProjectionMatrix();
  }

+  const fromStart = 0;
+  const fromEnd = 2;
+  const toStart = -0.5;
+  const toEnd = 0.5;
+  cursorTexture.offset.x = THREE.MathUtils.mapLinear(
+      time % 2,
+      fromStart, fromEnd,
+      toStart, toEnd);

  renderer.render(scene, camera);
}
</pre>
<p><code class="notranslate" translate="no">THREE.MathUtils.mapLinear</code> takes a value that goes between <code class="notranslate" translate="no">fromStart</code> and <code class="notranslate" translate="no">fromEnd</code>
and maps it to a value between <code class="notranslate" translate="no">toStart</code> and <code class="notranslate" translate="no">toEnd</code>. In the case above we're
taking <code class="notranslate" translate="no">time % 2</code> which means a value that goes from 0 to 2 and maps
that to a value that goes from -0.5 to 0.5</p>
<p><a href="textures.html">Textures</a> are mapped to geometry using normalized texture coordinates
that go from 0 to 1. That means our 2x1 pixel image, set to the default
wrapping mode of <code class="notranslate" translate="no">THREE.ClampToEdge</code>, if we adjust the
texture coordinates by -0.5 then the entire mesh will be the first color
and if we adjust the texture coordinates by +0.5 the entire mesh will
be the second color. In between with the filtering set to <code class="notranslate" translate="no">THREE.NearestFilter</code>
we'll be able to move the transition between the 2 colors through the geometry.</p>
<p>Let's add a background texture while we're at it just like we
covered in <a href="backgrounds.html">the article on backgrounds</a>.
We'll just use a 2x2 set of colors but set the texture's repeat
settings to give us an 8x8 grid. This will give our cursor something
to be rendered over so we can check it against different colors.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+const backgroundColors = new Uint8Array([
+    0,   0,   0, 255,  // black
+   90,  38,  38, 255,  // dark red
+  100, 175, 103, 255,  // medium green
+  255, 239, 151, 255,  // light yellow
+]);
+const backgroundTexture = makeDataTexture(backgroundColors, 2, 2);
+backgroundTexture.wrapS = THREE.RepeatWrapping;
+backgroundTexture.wrapT = THREE.RepeatWrapping;
+backgroundTexture.repeat.set(4, 4);

const scene = new THREE.Scene();
+scene.background = backgroundTexture;
</pre>
<p>Now if we run that you'll see we get a circle like gauge
and that we can set where the gauge is.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/webxr-look-to-select-selector.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/webxr-look-to-select-selector.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>A few things to notice <strong>and try</strong>.</p>
<ul>
<li><p>We set the <code class="notranslate" translate="no">cursorMaterial</code>'s <code class="notranslate" translate="no">blending</code>, <code class="notranslate" translate="no">blendSrc</code> and <code class="notranslate" translate="no">blendDst</code>
properties as follows</p>
<pre class="prettyprint showlinemods notranslate notranslate" translate="no">  blending: THREE.CustomBlending,
  blendSrc: THREE.OneMinusDstColorFactor,
  blendDst: THREE.OneMinusSrcColorFactor,
</pre><p>This gives as an <em>inverse</em> type of effect. Comment out
those 3 lines and you'll see the difference. I'm just guessing
the inverse effect is best here as that way we can hopefully
see the cursor regardless of the colors it is over.</p>
</li>
<li><p>We use a <a href="/docs/#api/en/geometries/TorusGeometry"><code class="notranslate" translate="no">TorusGeometry</code></a> and not a <a href="/docs/#api/en/geometries/RingGeometry"><code class="notranslate" translate="no">RingGeometry</code></a></p>
<p>For whatever reason the <a href="/docs/#api/en/geometries/RingGeometry"><code class="notranslate" translate="no">RingGeometry</code></a> uses a flat
UV mapping scheme. Because of this if we use a <a href="/docs/#api/en/geometries/RingGeometry"><code class="notranslate" translate="no">RingGeometry</code></a>
the texture slides horizontally across the ring instead of
around it like it does above.</p>
<p>Try it out, change the <a href="/docs/#api/en/geometries/TorusGeometry"><code class="notranslate" translate="no">TorusGeometry</code></a> to a <a href="/docs/#api/en/geometries/RingGeometry"><code class="notranslate" translate="no">RingGeometry</code></a>
(it's just commented out in the example above) and you'll see what I
mean.</p>
<p>The <em>proper</em> thing to do (for some definition of <em>proper</em>) would be
to either use the <a href="/docs/#api/en/geometries/RingGeometry"><code class="notranslate" translate="no">RingGeometry</code></a> but fix the texture coordinates
so they go around the ring. Or else, generate our own ring geometry.
But, the torus works just fine. Placed directly in front of the camera
with a <a href="/docs/#api/en/materials/MeshBasicMaterial"><code class="notranslate" translate="no">MeshBasicMaterial</code></a> it will look exactly like a ring and the
texture coordinates go around the ring so it works for our needs.</p>
</li>
</ul>
<p>Let's integrate it with our VR code above. </p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class PickHelper {
-  constructor() {
+  constructor(camera) {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
-    this.pickedObjectSavedColor = 0;

+    const cursorColors = new Uint8Array([
+      64, 64, 64, 64,       // dark gray
+      255, 255, 255, 255,   // white
+    ]);
+    this.cursorTexture = makeDataTexture(cursorColors, 2, 1);
+
+    const ringRadius = 0.4;
+    const tubeRadius = 0.1;
+    const tubeSegments = 4;
+    const ringSegments = 64;
+    const cursorGeometry = new THREE.TorusGeometry(
+        ringRadius, tubeRadius, tubeSegments, ringSegments);
+
+    const cursorMaterial = new THREE.MeshBasicMaterial({
+      color: 'white',
+      map: this.cursorTexture,
+      transparent: true,
+      blending: THREE.CustomBlending,
+      blendSrc: THREE.OneMinusDstColorFactor,
+      blendDst: THREE.OneMinusSrcColorFactor,
+    });
+    const cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
+    // add the cursor as a child of the camera
+    camera.add(cursor);
+    // and move it in front of the camera
+    cursor.position.z = -1;
+    const scale = 0.05;
+    cursor.scale.set(scale, scale, scale);
+    this.cursor = cursor;
+
+    this.selectTimer = 0;
+    this.selectDuration = 2;
+    this.lastTime = 0;
  }
  pick(normalizedPosition, scene, camera, time) {
+    const elapsedTime = time - this.lastTime;
+    this.lastTime = time;

-    // restore the color if there is a picked object
-    if (this.pickedObject) {
-      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
-      this.pickedObject = undefined;
-    }

+    const lastPickedObject = this.pickedObject;
+    this.pickedObject = undefined;

    // cast a ray through the frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      this.pickedObject = intersectedObjects[0].object;
-      // save its color
-      this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
-      // set its emissive color to flashing red/yellow
-      this.pickedObject.material.emissive.setHex((time * 8) % 2 &gt; 1 ? 0xFFFF00 : 0xFF0000);
    }

+    // show the cursor only if it's hitting something
+    this.cursor.visible = this.pickedObject ? true : false;
+
+    let selected = false;
+
+    // if we're looking at the same object as before
+    // increment time select timer
+    if (this.pickedObject &amp;&amp; lastPickedObject === this.pickedObject) {
+      this.selectTimer += elapsedTime;
+      if (this.selectTimer &gt;= this.selectDuration) {
+        this.selectTimer = 0;
+        selected = true;
+      }
+    } else {
+      this.selectTimer = 0;
+    }
+
+    // set cursor material to show the timer state
+    const fromStart = 0;
+    const fromEnd = this.selectDuration;
+    const toStart = -0.5;
+    const toEnd = 0.5;
+    this.cursorTexture.offset.x = THREE.MathUtils.mapLinear(
+        this.selectTimer,
+        fromStart, fromEnd,
+        toStart, toEnd);
+
+    return selected ? this.pickedObject : undefined;
  }
}
</pre>
<p>You can see the code above we added all the code to create
the cursor geometry, texture, and material and we added it
as a child of the camera so it will always be in front of
the camera. Note we need to add the camera to the scene
otherwise the cursor won't be rendered.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">+scene.add(camera);
</pre>
<p>We then check if the thing we're picking this time is the same as it was last
time. If so we add the elapsed time to a timer and if the timer reaches its
limit we return the selected item.</p>
<p>Now let's use that to pick the cubes. As a simple example
we'll add 3 spheres as well. When a cube is picked with hide
the cube and un-hide the corresponding sphere.</p>
<p>So first we'll make a sphere geometry</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
-const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
+const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
+
+const sphereRadius = 0.5;
+const sphereGeometry = new THREE.SphereGeometry(sphereRadius);
</pre>
<p>Then let's create 3 pairs of box and sphere meshes. We'll
use a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map"><code class="notranslate" translate="no">Map</code></a>
so that we can associate each <a href="/docs/#api/en/objects/Mesh"><code class="notranslate" translate="no">Mesh</code></a> with its partner.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-const cubes = [
-  makeInstance(geometry, 0x44aa88,  0),
-  makeInstance(geometry, 0x8844aa, -2),
-  makeInstance(geometry, 0xaa8844,  2),
-];
+const meshToMeshMap = new Map();
+[
+  { x:  0, boxColor: 0x44aa88, sphereColor: 0xFF4444, },
+  { x:  2, boxColor: 0x8844aa, sphereColor: 0x44FF44, },
+  { x: -2, boxColor: 0xaa8844, sphereColor: 0x4444FF, },
+].forEach((info) =&gt; {
+  const {x, boxColor, sphereColor} = info;
+  const sphere = makeInstance(sphereGeometry, sphereColor, x);
+  const box = makeInstance(boxGeometry, boxColor, x);
+  // hide the sphere
+  sphere.visible = false;
+  // map the sphere to the box
+  meshToMeshMap.set(box, sphere);
+  // map the box to the sphere
+  meshToMeshMap.set(sphere, box);
+});
</pre>
<p>In <code class="notranslate" translate="no">render</code> where we rotate the cubes we need to iterate over <code class="notranslate" translate="no">meshToMeshMap</code>
instead of <code class="notranslate" translate="no">cubes</code>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-cubes.forEach((cube, ndx) =&gt; {
+let ndx = 0;
+for (const mesh of meshToMeshMap.keys()) {
  const speed = 1 + ndx * .1;
  const rot = time * speed;
-  cube.rotation.x = rot;
-  cube.rotation.y = rot;
-});
+  mesh.rotation.x = rot;
+  mesh.rotation.y = rot;
+  ++ndx;
+}
</pre>
<p>And now we can use our new <code class="notranslate" translate="no">PickHelper</code> implementation
to select one of the objects. When selected we hide
that object and un-hide its partner.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">// 0, 0 is the center of the view in normalized coordinates.
-pickHelper.pick({x: 0, y: 0}, scene, camera, time);
+const selectedObject = pickHelper.pick({x: 0, y: 0}, scene, camera, time);
+if (selectedObject) {
+  selectedObject.visible = false;
+  const partnerObject = meshToMeshMap.get(selectedObject);
+  partnerObject.visible = true;
+}
</pre>
<p>And with that we should have a pretty decent <em>look to select</em> implementation.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/webxr-look-to-select-w-cursor.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/webxr-look-to-select-w-cursor.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>I hope this example gave some ideas of how to implement a "look to select"
type of Google Cardboard level UX. Sliding textures using texture coordinates
offsets is also a commonly useful technique.</p>
<p>Next up <a href="webxr-point-to-select.html">let's allow the user that has a VR controller to point at and move things</a>.</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>

# webxr-point-to-select.html

<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8">
    <title>VR - 3DOF Point to Select</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@threejs">
    <meta name="twitter:title" content="Three.js – VR - 3DOF Point to Select">
    <meta property="og:image" content="https://threejs.org/files/share.png">
    <link rel="shortcut icon" href="../../files/favicon_white.ico" media="(prefers-color-scheme: dark)">
    <link rel="shortcut icon" href="../../files/favicon.ico" media="(prefers-color-scheme: light)">

    <link rel="stylesheet" href="../resources/lesson.css">
    <link rel="stylesheet" href="../resources/lang.css">
<script type="importmap">
{
  "imports": {
    "three": "../../build/three.module.js"
  }
}
</script>
  </head>
  <body>
    <div class="container">
      <div class="lesson-title">
        <h1>VR - 3DOF Point to Select</h1>
      </div>
      <div class="lesson">
        <div class="lesson-main">
          <p><strong>NOTE: The examples on this page require a VR capable
device with a pointing device. Without one they won't work. See <a href="webxr.html">this article</a>
as to why</strong></p>
<p>In the <a href="webxr-look-to-select.html">previous article</a> we went over
a very simple VR example where we let the user choose things by
pointing via looking. In this article we will take it one step further
and let the user choose with a pointing device </p>
<p>Three.js makes is relatively easy by providing 2 controller objects in VR
and tries to handle both cases of a single 3DOF controller and two 6DOF
controllers. Each of the controllers are <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a> objects which give
the orientation and position of that controller. They also provide
<code class="notranslate" translate="no">selectstart</code>, <code class="notranslate" translate="no">select</code> and <code class="notranslate" translate="no">selectend</code> events when the user starts pressing,
is pressing, and stops pressing (ends) the "main" button on the controller.</p>
<p>Starting with the last example from <a href="webxr-look-to-select.html">the previous article</a>
let's change the <code class="notranslate" translate="no">PickHelper</code> into a <code class="notranslate" translate="no">ControllerPickHelper</code>.</p>
<p>Our new implementation will emit a <code class="notranslate" translate="no">select</code> event that gives us the object that was picked
so to use it we'll just need to do this.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const pickHelper = new ControllerPickHelper(scene);
pickHelper.addEventListener('select', (event) =&gt; {
  event.selectedObject.visible = false;
  const partnerObject = meshToMeshMap.get(event.selectedObject);
  partnerObject.visible = true;
});
</pre>
<p>Remember from our previous code <code class="notranslate" translate="no">meshToMeshMap</code> maps our boxes and spheres to
each other so if we have one we can look up its partner through <code class="notranslate" translate="no">meshToMeshMap</code>
so here we're just hiding the selected object and un-hiding its partner.</p>
<p>As for the actual implementation of <code class="notranslate" translate="no">ControllerPickHelper</code>, first we need
to add the VR controller objects to the scene and to those add some 3D lines
we can use to display where the user is pointing. We save off both the controllers
and the their lines.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ControllerPickHelper {
  constructor(scene) {
    const pointerGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1),
    ]);

    this.controllers = [];
    for (let i = 0; i &lt; 2; ++i) {
      const controller = renderer.xr.getController(i);
      scene.add(controller);

      const line = new THREE.Line(pointerGeometry);
      line.scale.z = 5;
      controller.add(line);
      this.controllers.push({controller, line});
    }
  }
}
</pre>
<p>Without doing anything else this alone would give us 1 or 2 lines in the scene
showing where the user's pointing devices are and which way they are pointing.</p>
<p>One problem we have though, we don't want have our <code class="notranslate" translate="no">RayCaster</code> pick the line itself
so an easy solution is separate the objects we wanted to be able to pick from the
objects we don't by parenting them under another <a href="/docs/#api/en/core/Object3D"><code class="notranslate" translate="no">Object3D</code></a>.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const scene = new THREE.Scene();
+// object to put pickable objects on so we can easily
+// separate them from non-pickable objects
+const pickRoot = new THREE.Object3D();
+scene.add(pickRoot);

...

function makeInstance(geometry, color, x) {
  const material = new THREE.MeshPhongMaterial({color});

  const cube = new THREE.Mesh(geometry, material);
-  scene.add(cube);
+  pickRoot.add(cube);

...
</pre>
<p>Next let's add some code to pick from the controllers. This is the first time
we've picked with something not the camera. In our <a href="picking.html">article on picking</a>
the user uses the mouse or finger to pick which means picking comes from the camera
into the screen. In <a href="webxr-look-to-select.html">the previous article</a> we
were picking based on which way the user is looking so again that comes from the
camera. This time though we're picking from the position of the controllers so
we're not using the camera.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ControllerPickHelper {
  constructor(scene) {
+    this.raycaster = new THREE.Raycaster();
+    this.objectToColorMap = new Map();
+    this.controllerToObjectMap = new Map();
+    this.tempMatrix = new THREE.Matrix4();

    const pointerGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1),
    ]);

    this.controllers = [];
    for (let i = 0; i &lt; 2; ++i) {
      const controller = renderer.xr.getController(i);
      scene.add(controller);

      const line = new THREE.Line(pointerGeometry);
      line.scale.z = 5;
      controller.add(line);
      this.controllers.push({controller, line});
    }
  }
+  update(pickablesParent, time) {
+    this.reset();
+    for (const {controller, line} of this.controllers) {
+      // cast a ray through the from the controller
+      this.tempMatrix.identity().extractRotation(controller.matrixWorld);
+      this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
+      this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
+      // get the list of objects the ray intersected
+      const intersections = this.raycaster.intersectObjects(pickablesParent.children);
+      if (intersections.length) {
+        const intersection = intersections[0];
+        // make the line touch the object
+        line.scale.z = intersection.distance;
+        // pick the first object. It's the closest one
+        const pickedObject = intersection.object;
+        // save which object this controller picked
+        this.controllerToObjectMap.set(controller, pickedObject);
+        // highlight the object if we haven't already
+        if (this.objectToColorMap.get(pickedObject) === undefined) {
+          // save its color
+          this.objectToColorMap.set(pickedObject, pickedObject.material.emissive.getHex());
+          // set its emissive color to flashing red/yellow
+          pickedObject.material.emissive.setHex((time * 8) % 2 &gt; 1 ? 0xFF2000 : 0xFF0000);
+        }
+      } else {
+        line.scale.z = 5;
+      }
+    }
+  }
}
</pre>
<p>Like before we use a <a href="/docs/#api/en/core/Raycaster"><code class="notranslate" translate="no">Raycaster</code></a> but this time we take the ray from the controller.
Our previous <code class="notranslate" translate="no">PickHelper</code> there was only one thing picking but here we have up to 2
controllers, one for each hand. We save off which object each controller is
looking at in <code class="notranslate" translate="no">controllerToObjectMap</code>. We also save off the original emissive color in
<code class="notranslate" translate="no">objectToColorMap</code> and we make the line long enough to touch whatever it's pointing at.</p>
<p>We need to add some code to reset these settings every frame.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ControllerPickHelper {

  ...

+  _reset() {
+    // restore the colors
+    this.objectToColorMap.forEach((color, object) =&gt; {
+      object.material.emissive.setHex(color);
+    });
+    this.objectToColorMap.clear();
+    this.controllerToObjectMap.clear();
+  }
  update(pickablesParent, time) {
+    this._reset();

    ...

}
</pre>
<p>Next we want to emit a <code class="notranslate" translate="no">select</code> event when the user clicks the controller.
To do that we can extend three.js's <a href="/docs/#api/en/core/EventDispatcher"><code class="notranslate" translate="no">EventDispatcher</code></a> and then we'll check
when we get a <code class="notranslate" translate="no">select</code> event from the controller, then if that controller
is pointing at something we emit what that controller is pointing at
as our own <code class="notranslate" translate="no">select</code> event.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">-class ControllerPickHelper {
+class ControllerPickHelper extends THREE.EventDispatcher {
  constructor(scene) {
+    super();
    this.raycaster = new THREE.Raycaster();
    this.objectToColorMap = new Map();  // object to save color and picked object
    this.controllerToObjectMap = new Map();
    this.tempMatrix = new THREE.Matrix4();

    const pointerGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1),
    ]);

    this.controllers = [];
    for (let i = 0; i &lt; 2; ++i) {
      const controller = renderer.xr.getController(i);
+      controller.addEventListener('select', (event) =&gt; {
+        const controller = event.target;
+        const selectedObject = this.controllerToObjectMap.get(controller);
+        if (selectedObject) {
+          this.dispatchEvent({type: 'select', controller, selectedObject});
+        }
+      });
      scene.add(controller);

      const line = new THREE.Line(pointerGeometry);
      line.scale.z = 5;
      controller.add(line);
      this.controllers.push({controller, line});
    }
  }
}
</pre>
<p>All that is left is to call <code class="notranslate" translate="no">update</code> in our render loop</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">function render(time) {

  ...

+  pickHelper.update(pickablesParent, time);

  renderer.render(scene, camera);
}
</pre>
<p>and assuming you have a VR device with a controller you should
be able to use the controllers to pick things.</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/webxr-point-to-select.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/webxr-point-to-select.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>And what if we wanted to be able to move the objects?</p>
<p>That's relatively easy. Let's move our controller 'select' listener
code out into a function so we can use it for more than one thing.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ControllerPickHelper extends THREE.EventDispatcher {
  constructor(scene) {
    super();

    ...

    this.controllers = [];

+    const selectListener = (event) =&gt; {
+      const controller = event.target;
+      const selectedObject = this.controllerToObjectMap.get(event.target);
+      if (selectedObject) {
+        this.dispatchEvent({type: 'select', controller, selectedObject});
+      }
+    };

    for (let i = 0; i &lt; 2; ++i) {
      const controller = renderer.xr.getController(i);
-      controller.addEventListener('select', (event) =&gt; {
-        const controller = event.target;
-        const selectedObject = this.controllerToObjectMap.get(event.target);
-        if (selectedObject) {
-          this.dispatchEvent({type: 'select', controller, selectedObject});
-        }
-      });
+      controller.addEventListener('select', selectListener);

       ...
</pre>
<p>Then let's use it for both <code class="notranslate" translate="no">selectstart</code> and <code class="notranslate" translate="no">select</code></p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ControllerPickHelper extends THREE.EventDispatcher {
  constructor(scene) {
    super();

    ...

    this.controllers = [];

    const selectListener = (event) =&gt; {
      const controller = event.target;
      const selectedObject = this.controllerToObjectMap.get(event.target);
      if (selectedObject) {
-        this.dispatchEvent({type: 'select', controller, selectedObject});
+        this.dispatchEvent({type: event.type, controller, selectedObject});
      }
    };

    for (let i = 0; i &lt; 2; ++i) {
      const controller = renderer.xr.getController(i);
      controller.addEventListener('select', selectListener);
      controller.addEventListener('selectstart', selectListener);

       ...
</pre>
<p>and let's also pass on the <code class="notranslate" translate="no">selectend</code> event which three.js sends out
when you user lets of the button on the controller.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">class ControllerPickHelper extends THREE.EventDispatcher {
  constructor(scene) {
    super();

    ...

    this.controllers = [];

    const selectListener = (event) =&gt; {
      const controller = event.target;
      const selectedObject = this.controllerToObjectMap.get(event.target);
      if (selectedObject) {
        this.dispatchEvent({type: event.type, controller, selectedObject});
      }
    };

+    const endListener = (event) =&gt; {
+      const controller = event.target;
+      this.dispatchEvent({type: event.type, controller});
+    };

    for (let i = 0; i &lt; 2; ++i) {
      const controller = renderer.xr.getController(i);
      controller.addEventListener('select', selectListener);
      controller.addEventListener('selectstart', selectListener);
+      controller.addEventListener('selectend', endListener);

       ...
</pre>
<p>Now let's change the code so when we get a <code class="notranslate" translate="no">selectstart</code> event we'll
remove the selected object from the scene and make it a child of the controller.
This means it will move with the controller. When we get a <code class="notranslate" translate="no">selectend</code>
event we'll put it back in the scene.</p>
<pre class="prettyprint showlinemods notranslate lang-js" translate="no">const pickHelper = new ControllerPickHelper(scene);
-pickHelper.addEventListener('select', (event) =&gt; {
-  event.selectedObject.visible = false;
-  const partnerObject = meshToMeshMap.get(event.selectedObject);
-  partnerObject.visible = true;
-});

+const controllerToSelection = new Map();
+pickHelper.addEventListener('selectstart', (event) =&gt; {
+  const {controller, selectedObject} = event;
+  const existingSelection = controllerToSelection.get(controller);
+  if (!existingSelection) {
+    controllerToSelection.set(controller, {
+      object: selectedObject,
+      parent: selectedObject.parent,
+    });
+    controller.attach(selectedObject);
+  }
+});
+
+pickHelper.addEventListener('selectend', (event) =&gt; {
+  const {controller} = event;
+  const selection = controllerToSelection.get(controller);
+  if (selection) {
+    controllerToSelection.delete(controller);
+    selection.parent.attach(selection.object);
+  }
+});
</pre>
<p>When an object is selected we save off that object and its
original parent. When the user is done we can put the object back.</p>
<p>We use the <a href="/docs/#api/en/core/Object3D.attach"><code class="notranslate" translate="no">Object3D.attach</code></a> to re-parent
the selected objects. These functions let us change the parent
of an object without changing its orientation and position in the
scene. </p>
<p>And with that we should be able to move the objects around with a 6DOF
controller or at least change their orientation with a 3DOF controller</p>
<p></p><div translate="no" class="threejs_example_container notranslate">
  <div><iframe class="threejs_example notranslate" translate="no" style=" " src="/manual/examples/resources/editor.html?url=/manual/examples/webxr-point-to-select-w-move.html"></iframe></div>
  <a class="threejs_center" href="/manual/examples/webxr-point-to-select-w-move.html" target="_blank">click here to open in a separate window</a>
</div>

<p></p>
<p>To be honest I'm not 100% sure this <code class="notranslate" translate="no">ControllerPickHelper</code> is
the best way to organize the code but it's useful to demonstrating
the various parts of getting something simple working in VR
in three.js</p>

        </div>
      </div>
    </div>

  <script src="../resources/prettify.js"></script>
  <script src="../resources/lesson.js"></script>




</body></html>