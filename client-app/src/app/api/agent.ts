import axios, { AxiosError, AxiosResponse } from 'axios';
import { Activity } from '../models/activity';

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  })
}


axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(async response => {
  try {
    await sleep(1000);
    return response;
  } catch (error) {
    console.log(error);
    return await Promise.reject(error);
  }
})

//exponde the body of the response
// <T> generic type used to define the response returned as response.data
const responseBody = <T> (response: AxiosResponse<T>) => response.data;

// expone the api method for a specific request.
// the generic type <T> is used to map the result of the request on a specific type
const requests = {
  get:  <T> (url: string) => axios.get<T>(url).then(responseBody),
  post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put:  <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del:  <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

// expone the activities collection as the call to the api baseUrl + '/activities'
const Activities = {
  list:     ()                    => requests.get<Activity[]>('/activities'),
  details:  (id: string)          => requests.get<Activity>('activities/' + id),
  create:   (activity: Activity)  => requests.post<void>('/activities', activity),
  update:   (activity: Activity)  => requests.put<void>('/activities/' + activity.id, activity),
  // delete: (id: string) => requests.del<void>('/activities/f5812cdd-9fe5-429e-a8f3-7f143f24f0c4')
  delete: (id: string) => requests.del<void>('/activities/' + id)

}

const agent = {
  Activities
}

// this is the object exponed outside and the one that we will use in the application.
// it will expone activites => agent.Activities
export default agent;