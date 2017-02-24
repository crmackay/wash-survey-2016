# wash-survey-2016
webapp for collection of batey WASH survey data - spring 2016

- this is the code for the frontend webapp (typescript), and the backend web server (golang)


## how is works:

- uses an appcache manifest to work offline
- saves data on the device until the "upload" button is pressed
- once upload is initiated user is required to login to the server
- once verified, each data entry is saved to the server, confirmed, then deleted from the device

## To Dos:

- allow for multiple forms/surveys

- generate forms from a csv file describing the form and the data to be collected

- add edit or delete a saved-on-device entry

- allow to view all records on server and download as csv
    - with timestamp and version attached

- individual login and roles
