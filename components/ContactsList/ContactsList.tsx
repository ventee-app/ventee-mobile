import React, { memo, useMemo } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';

import Contact from './components/Contact';
import { ExtendedContact } from '../../types/data-models';
import Input from '../Input';
import styles from './styles';

interface ContactListProps {
  actionButtonText: string;
  contacts: ExtendedContact[];
  handleActionButton: () => void;
  handleCancel?: (() => void) | null;
  handleCheckAll: () => void;
  handleCheckBox: (id: string) => void;
  handleClearSearch: () => void;
  handleUncheckAll: () => void;
  searchValue: string;
  setSearch: (value: string) => void;
  type?: string;
}

function ContactList(props: ContactListProps): React.ReactElement {
  const {
    actionButtonText,
    contacts,
    handleActionButton,
    handleCancel,
    handleCheckAll,
    handleCheckBox,
    handleClearSearch,
    handleUncheckAll,
    searchValue,
    setSearch,
    type,
  } = props;

  const renderItem = ({ item }: any): React.ReactElement => (
    <Contact
      handleCheckBox={handleCheckBox}
      id={item.id}
      isChecked={item.isChecked}
      name={item.name}
    />
  );

  const actionButtonStatus = useMemo(
    (): boolean => contacts.filter(
      (item: ExtendedContact): boolean => item.isChecked,
    ).length === 0,
    [contacts],
  );

  return (
    <>
      <Input
        handleClear={handleClearSearch}
        handleInput={setSearch}
        placeholder="Search"
        value={searchValue}
      />
      <FlatList
        data={
          searchValue
            ? contacts.filter(
              ({ name = '' }: ExtendedContact): boolean => name.includes(searchValue),
            )
            : contacts
        }
        keyExtractor={(item: ExtendedContact): string => item.id}
        renderItem={renderItem}
        style={{
          maxWidth: '100%',
        }}
      />
      <View style={styles.listControls}>
        <Pressable
          onPress={handleCheckAll}
          style={styles.checkButton}
        >
          <Text style={styles.checkButtonText}>
            Check all
          </Text>
        </Pressable>
        <Pressable
          onPress={handleUncheckAll}
          style={styles.checkButton}
        >
          <Text style={styles.checkButtonText}>
            Unheck all
          </Text>
        </Pressable>
        { type === 'receive' && handleCancel && (
          <Pressable
            onPress={handleCancel}
            style={styles.checkButton}
          >
            <Text style={styles.checkButtonText}>
              Cancel
            </Text>
          </Pressable>
        ) }
        <Pressable
          disabled={actionButtonStatus}
          onPress={handleActionButton}
          style={
            actionButtonStatus
              ? styles.generateQRButtonDisabled
              : styles.generateQRButton
          }
        >
          <Text style={styles.generateQRButtonText}>
            { actionButtonText }
          </Text>
        </Pressable>
      </View>
    </>
  );
}

ContactList.defaultProps = {
  handleCancel: null,
  type: 'share',
};

export default memo(ContactList);
