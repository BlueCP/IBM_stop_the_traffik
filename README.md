# IBM x Stop the Traffik 

## Table of Contents
1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [Repository Structure](#repository-structure)
4. [Specifications](#specifications) 
5. [Relevant Code](#relevant-code)
6. [Materials Sourced and Used](#materials-sourced-and-used)
8. [How to Use This Repository](#how-to-use-this-repository)
9. [Demo Video](#demo-video)
10. [Authors](#authors)


<!-- SECTION 1 -->
## Introduction

The IBM x Stop the Traffik project involves creating an AR app and a chatbot to demonstrate IBM's technological contributions to the charity. This repository documents the project's development process, including the relevant code, specifications, materials sourced, meeting records, and decision records.


<!-- SECTION 2 -->
## Project Overview

This project aims to showcase how IBM's technologies are used to support the charity Stop the Traffik. The project includes an Augmented Reality (AR) app and a chatbot that answers questions about the charity and IBM's contributions.


<!-- SECTION 3 -->
## Repository Structure

This repository is organized into the following sections:


<!-- SECTION 4 -->
## Specifications

Includes the technical specifications, functional and non-functional requirements.


<!-- SECTION 5 -->
## Relevant Code

Contains the source code and configurations for the website with the integrated chatbot and AR exhibit.

The main folder is TAH_AR_Exhibit, which contains all necessary files to run the experience.

TAH_AR_Exhibit/final:
- **index.html**: The main HTML file for the AR exhibit.
- **app.js**: The JavaScript file containing the logic for the AR exhibit.

TAH_AR_Exhibit/shared:
- **utils.js**: Utility functions used throughout the AR exhibit codebase.
- **app.css**: The CSS file for styling the AR exhibit.


<!-- SECTION 6 -->
## Materials Sourced and Used

Documents the software, APIs, libraries and development tools used in this project.


### Software and Technologies
- **IBM Cloud**: Used for hosting and managing the backend services of the AR exhibit and chatbot.
- **IBM Watson Assistant:** Selected for its robust natural language understanding capabilities, which enable the chatbot to interpret and respond to user queries effectively and intuitively
- **Programmable Search Engine:** Deployed to facilitate real-time search functionalities, this technology aids the chatbot in delivering accurate and up-to-date information by accessing external databases and websites, thus broadening the data scope available for user queries


### Libraries and Extensions
- **three.js**: Chosen for its flexibility in 3D graphics rendering, support for markerless AR, and extensive extensions like GLTFLoader, FontLoader, and TextGeometry, making it ideal for developing immersive AR experiences.


#### Extensions 
- **GLTFLoader** for efficient 3D model loading and rendering 
- **FontLoader** for efficient 3D model loading and rendering
- **TextGeometry** for creating 3D text geometry, used for providing an enhanced user engagement through a guided captioning experience


### APIs
- **WebXR Device API:** Selected for its comprehensive support for immersive AR sessions, enabling the seamless integration of AR functionalities and providing a robust framework for interacting with XR hardware and software.


#### Extensions 
- **XRSession** for managing AR sessions
- **XRWebGLLayer** for creating WebGL rendering context for AR
- **XRReferenceSpace** for defining coordinate systems


### Development Tools
- **Visual Studio Code**: A source-code editor used by the development team for writing and managing code.
- **GitHub**: Used for version control and collaboration on the project codebase.


<!-- SECTION 7
## Meeting Records & Decision Log

Records of all meetings held during the project, including minutes, agendas, and a decision log of all major decisions taken during the project. -->


<!-- SECTION 9 -->
## Testing

Contains testing files for various frameworks and libraries that were considered for the project.

AFrame and Blender were originally considered to develop the AR Exhibit however after various testing it was decided that three.js was a better library. 

<!-- SECTION 8 -->
## How to Use This Repository

- **Clone the Repository**: Clone this repository to your local machine to access and contribute to the DHF.
    ```sh
    git clone https://github.com/your-username/IBM-StopTheTraffik-DHF.git
    ```

- **Navigate using this README**: The README file serves as the main page containing essential information about the project. Use it to navigate and understand the repository's purpose, structure, and guidelines.

- **Contribute**: Submit changes via pull requests. Ensure all changes are well-documented and reviewed.

<!-- SECTION 9 -->
## Demo Video
A demo video showcasing the project's features and functionalities is available:
[here](https://drive.google.com/drive/folders/1UT_JhSFMgOTBW09LfRNaDjp3g8_FFwx_?usp=drive_link)

<!-- SECTION 10 -->
## Authors
- Alex Boorman
- Jackson Barlow
- Kishok Sivakumaran
- Monika Koppuravuri
- Roshan Aekbote 
- Yi Zhang

<!-- ## Contact

For any questions or further information, please contact:

- **Project Lead**: [Your Name] - [your.email@example.com]
- **Technical Lead**: [Your Name] - [your.email@example.com] -->

---

<!-- **Note**: Ensure that all documents uploaded to this repository comply with the relevant regulatory and compliance requirements. -->
