import React, { memo } from 'react';
import { FlatList, View } from 'react-native';

import { ExtendedContact } from '../../../types/data-models';

interface SaveContactsLayoutProps {
  contacts: ExtendedContact[];
  handleCheck: (id: string) => void;
}

function SaveContactsLayout(props: SaveContactsLayoutProps): React.ReactElement {
  const {
    contacts,
    handleCheck,
  } = props;

  return (
    <>

    </>
  );
}

export default memo(SaveContactsLayout);
