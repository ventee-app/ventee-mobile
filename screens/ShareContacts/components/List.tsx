import React, { memo, useMemo } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';

import Contact from './components/Contact';
import { ExtendedContact } from '../../../types/data-models';
import Input from '../../../components/Input';
import styles from '../styles';

interface ListProps {
  contacts: ExtendedContact[];
  handleCheckAll: () => void;
  handleCheckBox: (id: string) => void;
  handleClear: () => void;
  handleGenerateQR: () => void;
  handleUncheckAll: () => void;
  searchValue: string;
  setSearch: (value: string) => void;
}

function List(props: ListProps): React.ReactElement {
  const {
    contacts,
    handleCheckAll,
    handleCheckBox,
    handleClear,
    handleGenerateQR,
    handleUncheckAll,
    searchValue,
    setSearch,
  } = props;

  const renderItem = ({ item }: any): React.ReactElement => (
    <Contact
      handleCheckBox={handleCheckBox}
      id={item.id}
      isChecked={item.isChecked}
      name={item.name}
    />
  );

  const generateButtonStatus = useMemo(
    (): boolean => contacts.filter(
      (item: ExtendedContact): boolean => item.isChecked,
    ).length === 0,
    [contacts],
  );

  return (
    <>
      <Input
        handleClear={handleClear}
        handleInput={setSearch}
        placeholder="Search"
        value={searchValue}
      />
      <FlatList
        data={
          searchValue
            ? contacts.filter(
              (item: ExtendedContact): boolean => item.name.includes(searchValue),
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
        <Pressable
          disabled={generateButtonStatus}
          onPress={handleGenerateQR}
          style={
            generateButtonStatus
              ? styles.generateQRButtonDisabled
              : styles.generateQRButton
          }
        >
          <Text style={styles.generateQRButtonText}>
            Generate QR
          </Text>
        </Pressable>
      </View>
    </>
  );
}

export default memo(List);
