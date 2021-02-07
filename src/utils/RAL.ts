// No need for this redirecting from routes
// handle url convertion when ral is for post
// from p/:id to post:/id

const saveRAL = () => {
  let path = window.location.pathname;
  console.log('1', path);

  // const c = path.split('/');

  // // if p convert to post
  // if (c[1] === 'p') {
  //   c[1] = 'post';
  // }
  // path = c.join('/');
  window.localStorage.setItem('RAL', path);
};

export { saveRAL };
