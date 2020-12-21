import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import ExploreLayout from './exploreLayout';
import { LOADER_OBJECTS } from './images';

const Explore = () => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);
  if (loading) {
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <Spin size="small" />
        <p>Loading your stuff...</p> */}
        <img
          height="200"
          width="100"
          src={LOADER_OBJECTS.LOADING_GEARS_01}
          alt="LOADING"
        />
      </div>
    );
  }
  const postsArray = [
    'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8aHVtYW58ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
    'https://i.pinimg.com/originals/ca/76/0b/ca760b70976b52578da88e06973af542.jpg',
    'https://cdn.spacetelescope.org/archives/images/wallpaper2/heic2007a.jpg',

    'https://images.pexels.com/photos/3371487/pexels-photo-3371487.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://i.pinimg.com/originals/71/1f/fa/711ffaa58988030dbabf3018db1a01b7.jpg',
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/94b86f0e-f722-4349-8f41-2e543799d09f/d5hgros-de5b701e-6631-4ea7-ac81-9b051fbf6822.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvOTRiODZmMGUtZjcyMi00MzQ5LThmNDEtMmU1NDM3OTlkMDlmXC9kNWhncm9zLWRlNWI3MDFlLTY2MzEtNGVhNy1hYzgxLTliMDUxZmJmNjgyMi5qcGcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.k8p06KcIxoLIrZ5ImhzQ6N3szv9a90MW3aIhCfzeUF4',
    'https://i.pinimg.com/originals/0e/45/a8/0e45a874482af5f7d523282e12bf8a75.jpg',
    'https://cdna.artstation.com/p/assets/images/images/019/293/032/large/kiki-andriansyah-hex-y.jpg?1562838735',
    'https://fsa.zobj.net/crop.php?r=0yrakYIE2hyBIa00R2jfegRfTWK7CSjdwulchyOXW1K5H1mDEE2iGE8tdw85BM1gawqnYHRCEs_c76f3rTnoCaYJIMQlFUbwi03kMNOepCKc5wkyVVP28qfLh4g3XmM_W2WSEfDJ1LB9R2xn',
  ];
  return (
    <Row justify="center" className="explore__container">
      <Col span={18}>
        <ExploreLayout arrayOfPosts={postsArray} />
        <ExploreLayout arrayOfPosts={postsArray} />
        <ExploreLayout arrayOfPosts={postsArray} />
      </Col>
    </Row>
  );
};

export default Explore;
