import NavigationService from '../config/NavigationService';
import GLOBALS from '../config/globals';
import firebase from '../config/firebase';
import {
  MOM_CHANGED,
  MOMS_FETCH_SUCCESS,
  SAVING_MOM,
  SAVE_MOM_FAIL,
  ADD_MOM_TO_LIST,
  MOM_LIST_REFRESHING
} from './types';

export const momChanged = ({ prop, value }) => ({
  type: MOM_CHANGED,
  payload: { prop, value }
});

const getMomsFromFirebase = (dispatch, { userUid }) => {
  const firestore = firebase.firestore();
  firestore
    .collection('moms')
    .where('userUid', '==', userUid)
    .get()
    .then(snapshot => {
      const momsList = snapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() };
      });
      dispatch({ type: MOMS_FETCH_SUCCESS, payload: momsList });
    });
};

export const fetchMoms = ({ userUid }) => dispatch => {
  getMomsFromFirebase(dispatch, { userUid });
};

export const refreshMoms = ({ userUid }) => dispatch => {
  dispatch({ type: MOM_LIST_REFRESHING });
  getMomsFromFirebase(dispatch, { userUid });
};

const saveMomSuccess = (dispatch, mom) => {
  console.log('momLog', mom);
  dispatch({
    type: ADD_MOM_TO_LIST,
    payload: mom
  });
  NavigationService.goBack();
};

const saveMomFail = (dispatch, error) => {
  dispatch({
    type: SAVE_MOM_FAIL,
    payload: error
  });
};

const validateFields = ({ zipcode }) => {
  let errors = [];
  if (zipcode.length != GLOBALS.ZIPCODE_LENGTH) {
    errors.push('Zipcode Must Be 5 Digits');
  }
  return errors;
};

const sendNewMom = (dispatch, { userUid, name, phoneNumber, zipcode }) => {
  dispatch({ type: SAVING_MOM });
  let momData = {
    userUid,
    name,
    phoneNumber,
    zipcode
  };

  firebase
    .firestore()
    .collection('moms')
    .add(momData)
    .then(mom => {
      momData['id'] = mom.id;
      saveMomSuccess(dispatch, momData);
    })
    .catch(error => {
      saveMomFail(dispatch, error.message);
    });
};

export const createMom = fields => dispatch => {
  const errors = validateFields(fields);
  if (errors.length == 0) {
    sendNewMom(dispatch, fields);
  } else {
    saveMomFail(dispatch, errors.join('\n'));
  }
};
