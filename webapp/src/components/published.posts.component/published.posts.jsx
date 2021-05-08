import React, { useState, useEffect } from 'react';
import ShowFeed from '../show.feed.component/show.feed';

const PublishedPostsList = ({ windowWidth, posts, loading }) => {
  return (
    <>
      <ShowFeed windowWidth={windowWidth} loading={loading} feeds={posts}/>
    </>
  );
}

export default PublishedPostsList;