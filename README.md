#  Special Collections 

![](https://img.shields.io/npm/v/npm) ![](https://img.shields.io/npm/v/antd?color=green&label=antd) ![](https://img.shields.io/npm/v/react?label=react)  ![](https://img.shields.io/npm/v/react-router?color=green&label=react-router) ![](https://img.shields.io/npm/v/react-cookie?label=react-cookie)

> Special Collections is a data display website, which talks to APIs provided by Omeka S .
>
> To run this app, an Omeka S back-end should be deployed on an accessible machine.
>
> For more information, please have a look at  https://omeka.org/s/ 

## Background

The famous Omeka S platform has provided us with a pretty interface. However, it is not as convenient in some instances. This application offers a gentle way to display data already stored in Omeka S, basically for Rice University lecture use.

## Install

**Before you install, please clone the repository and make sure you have the latest version of node and npm**

In the project directory, you can run:

##### `npm install`

Install all the essential dependencies of this app.<br />

##### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

##### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

##### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Usage

### Welcome 

- Editor: full writing authorities (create projects, notes, and transcripts).

- Guest: can only view, but not modify.

- Unlogged in: can go nowhere on the site except for the log-in page.

- Note: only when this app is deployed on the same machine with the Omeka S back-end, and you have a valid key pair, can you log in as an editor. Otherwise, you can only log in as a guest.

### Archive

+ #### Tree View

  - By typing in the item id of a root item, you can view your archives in a tree structure.

  - By clicking on the title of each tree node, you can view all its child nodes.
  - By checking on the box before each tree node, you can view the child items in `Dynamic Columns`.

  - Note: use properties `dcterms:isPartOf` and `dcterms:hasPart`  in items for identifying parent-child relationship.

+ #### Search

  - It is a quite flexible search function, thanks to the subtle search API provided by Omeka S.
  - If you want to search for items with specific keywords within certain property fields, please add a property.
    - Joiner: the relationship between the current condition with the other conditions.
    - Property: the title of the property you want to search a keyword within.
    - Relation: whether the keyword is exactly/not exactly/contained in/not contained in/... the property's value.
    - Keyword: the keyword itself.
  - If you want to narrow down search range, you can run the search in certain classes and projects.
  - Transcript search: you can search a certain keyword in the transcripts of media.
  - Note: it does not support searching in a search result yet.
  - Note: it does not support searching items and media at the same time yet.

+ #### Dynamic Columns

  - It is the main area for general data display and filter.
  - You can select whether a property should be displayed above the table. If you find the properties are too many to pick one, type the property name in the bar.
  - You can sort the data by clicking on the name of each property.

  - By clicking on each row, you can preview the corresponding item's contents on the right side.
  - If you have the `View` column, click on it, and you will open a new window with the item information in it.

  - Note: if you generate data from `Tree View`, only child items will be displayed here.

+ #### Card View

  + It is another form to display the same data as `Dynamic Columns`.
  + You can adjust the layout of the view by sliding the upper slider.
  + Click on the lower half of each card, and you can open an `Item` window.

### Project

+ A project is a collection of items. You can create one by clicking the `Create Project` button.
+ If you click on the button under the dynamic columns, all items you have checked will be included in your new project; and if you do it on the `Item` page, the item you are looking at will be included in your new project; `Add to Project` works similarly.
+ You can see the existed projects list when you switch to the `Project` tab. If you hover your mouse on the project's name, you'll see all the items included in it.
+ By clicking on the item's name, you'll open an `Item` tab in the middle of the page.
+ Note: a project is an item set physically, if you ask.

### Item

+ It is a minimum carrier of information.

+ It can be displayed both in a separate window or in a tab in the `Project` page.

+ On the top of this page, you can use the parent-child path to navigate.

+ #### Media Viewer

  - You can use either your mouse or keyboard to zoom in/out, rotate, flip and drag the images.
  - If you click on the second to last icon in the toolbar, you will download the media.
  - If you click on the rightmost icon in the toolbar, you will open the `Transcript` page.
  - If you have Universal Viewer installed on your site, you can click `Go to Universal Viewer` button and view those media using UV.
  - Note: it cannot fully support all kinds of media formats, so if the media do not display correctly, please try to download it.

+ #### Meta-data Viewer

  - It displays specific data related to the item. Enjoy it.
  - It can identify the links to other items and other web links, you can click on it to open it in new window.
  - Yeah, there *is* an `Edit button`. But it only leads you to the original Omeka S interface for editing it (sorry, too lazy to implement it).

### Note

+ *Coming soon...*

### Transcript

+ *Coming soon...*

+ Note: use property `bibo:transcriptOf` to indicate the transcript of media.

## Maintainer

[@Yudai Chen](https://github.com/Yudai-Chen)