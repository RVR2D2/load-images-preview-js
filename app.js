import firebase from 'firebase/app';
import 'firebase/storage';
import { upload } from './upload';

const firebaseConfig = {
    apiKey: "AIzaSyAcmNpBDm357UVXqMdyGZxT389wYA0AGAs",
    authDomain: "fe-upload-197c3.firebaseapp.com",
    projectId: "fe-upload-197c3",
    storageBucket: "fe-upload-197c3.appspot.com",
    messagingSenderId: "622829786885",
    appId: "1:622829786885:web:c8114841b98e13c380c96c"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
           const ref = storage.ref(`images/${file.name}`);
          const task = ref.put(file);

          task.on('state_changed', snapshot => {
              const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%';
              const block = blocks[index].querySelector('.preview-info-progress');
              block.textContent = percentage;
              block.style.width = percentage;
          }, error => {
              console.log(error);
          }, () => {
              task.snapshot.ref.getDownloadURL().then(url => {
                  console.log('Download URL:', url);
              });
          });
        });
    }
});
