# Monumental - Android

![homepage](../projects/monumental/monumental.webp)

---

## Technologies & Frameworks

- Android Framework [![icon](../logos/tech/android.png)](https://developer.android.com/)
- Kotlin programming language [![icon](../logos/tech/kotlin.png)](https://kotlinlang.org/)
- Firebase [![icon](../logos/tech/firebase.png)](https://firebase.google.com/)

---

## Features

More and more people go on far away ventures to foreign countries to see the world.
Traveling is expensive, and a lot to organize, because of that many people travel without a
dedicated guide to show them around and give information about the local landmarks
wherever they might be visiting. The vision for the Monumental Android application is to give
tourists anywhere in the world that travel without a guide the ability to get information about
landmarks by taking a picture of it. Next to that they will be able to keep track of what
landmarks they have visited and add them to their journey so that they are able to later look
back on all the landmarks they have visited.

Within the application a user will be able to take a picture using a live camera preview or
choose an existing picture from the phone’s storage. When a picture is taken or chosen the
application immediately gives a response if one or more landmarks have been detected
within the image. If one or more landmarks are detected in the image the application allows
the user to see the names of the landmarks. Users also have the ability to gather more
information about the found landmark(s) by performing a search for it from within the
application.

Users are also able to create journeys. Pictures of landmarks they take can be added to their
journeys which they are able to reference again later. That way users can see their past
journeys and what landmarks they have visited there. When a landmark is opened the picture
taken in which the landmark was detected can be viewed again.


---

## Screens

![flex screenshot](../projects/monumental/monumental_1.webp)
![flex screenshot](../projects/monumental/monumental_2.webp)
![flex screenshot](../projects/monumental/monumental_3.webp)
<video class="flex" autoplay muted loop playsinline controls src="../projects/monumental/monumental_demo.mp4"></video>

---

## Techniques & Libraries

- [MVVM Architecture](https://developer.android.com/jetpack/guide)
- [Room Persistence Library](https://developer.android.com/training/data-storage/room)
- [Kotlin Coroutines](https://developer.android.com/kotlin/coroutines)
- [Kotlin Coroutines](https://developer.chrome.com/docs/android/custom-tabs/overview/)
- [Picasso Library](https://developer.chrome.com/docs/android/custom-tabs/overview/)
- [Glide Library](https://developer.chrome.com/docs/android/custom-tabs/overview/)
- [Firebase ML Kit Landmark Recognition](https://firebase.google.com/docs/ml-kit/recognize-landmarks)
- [PinchToZoom](https://github.com/martinwithaar/PinchToZoom)

---

<details>
  <summary>Code Snippets</summary>
<div>

The following are some code snippets of pieces of code I'm proud of from this project. The snippets demonstrate clean, consice and powerful code. _(Code has been compacted)_

**ViewModel for the Landmarks fragment**\
All communication between the View and Model is done through the ViewModel according to the MVVM architecture as is demonstrated throughout the project.

```
package com.example.monumental.viewModel.landmark

class LandmarksViewModel(application: Application) : AndroidViewModel(application) {

    private val landmarkRepository = LandmarkRepository(application.applicationContext)
    private val journeyRepository = JourneyRepository(application.applicationContext)
    private val bitmapHelper = BitmapHelper()
    private val mediaFileHelper = MediaFileHelper()

    private val mainScope = CoroutineScope(Dispatchers.Main)

    /**Inserts new Landmark
     * @return Long ID of inserted journey */
    fun createLandmark(landmark: Landmark) { mainScope.launch {
    landmarkRepository.insertLandmark(landmark) } }
    /**Gets all Landmarks of Journey
     * @param journeyId ID of Landmark to get Landmarks of
     * @return List of Landmarks */
    fun getLandmarksByJourney(journeyId: Int): LiveData<List<Landmark>?> {
    return landmarkRepository.getLandmarksByJourney(journeyId) }
    /**Sets the active Journey, unset all other journeys
     * @param journey Journey to set to active */
    fun setActiveJourney(journey: Journey) { mainScope.launch { journeyRepository.setActiveJourney(journey) } }
    /**Gets a Bitmap from the device storage
     * @param contentResolver ContentResolver class provides applications access to the content model
     * @param imageUri Uri image to retrieve
     * @return Bitmap that's retrieved */
    fun getBitmap(contentResolver: ContentResolver?, imageUri: Uri): Bitmap? {
    return bitmapHelper.getBitmap(contentResolver!!, imageUri) }
    /** Creates a File for saving an image
     * @return File */
    fun getOutputMediaFile(): File? { return mediaFileHelper.getOutputMediaFile() }
    /**Creates a file Uri for saving an image
     * @return Uri from File */
    fun getOutputMediaFileUri(): Uri { return mediaFileHelper.getOutputMediaFileUri() }
    /**Removes a Landmark
     * @param landmark Landmark to remove */
    fun deleteLandmark(landmark: Landmark): Int = runBlocking {
    return@runBlocking landmarkRepository.deleteLandmark(landmark) }
}
```

**Journeys fragment delete operation**\
These methods demonstrate the builder design pattern and, object-oriented and effective functional programming approach and proper use of the Kotlin programming language.

```
/**When Journey delete button is clicked
 * Builds dialog for delete confirmation
 * @param journey Journey to delete */
private fun journeyDelete(journey: Journey) {
    val builder: AlertDialog.Builder = AlertDialog.Builder(context)
        .setTitle("Remove ${journey.name}?")
        .setMessage("Are you sure?")
        .setPositiveButton("Yes") { dialog, _ ->
            deleteJourney(journey)
            dialog.dismiss() }
        .setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
    val alert: AlertDialog = builder.create()
    alert.show() }

/** Deleted journey from database and alerts user of opreration success
 * @param journey Journey to update */
private fun deleteJourney(journey: Journey) {
    if (viewModel.deleteJourney(journey) == 1) { // Returns number of affected rows
        Toast.makeText(requireContext(), getString(R.string.journey_deleted, journey.name),
            Toast.LENGTH_SHORT).show()
    } else {
        Toast.makeText(requireContext(), getString(R.string.journey_not_deleted, journey.name),
            Toast.LENGTH_SHORT).show()
    }
}
```

</div>
</details>

---

## Check out the project

[<button>![icon](../logos/tech/github.png) Github</button>](https://github.com/alianza/Monumental)
[<button>APK Download</button>](https://google.com/)
[<button>Technical Docs</button>](https://drive.google.com/file/d/162SAxWKRrIahK1M_R8Q7BtnR_OMhz13o/view?usp=sharing)

---
