'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { IconPencilPlus, IconX } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import {
  ActionIcon,
  Avatar,
  Center,
  Combobox,
  Group,
  Input,
  InputBase,
  Kbd,
  Loader,
  ScrollArea,
  Skeleton,
  Text,
  useCombobox,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Tables } from '@/supabase/database.types';
import { useSession } from '@/supabase/lib/use-auth';
import useSupabase from '@/supabase/lib/use-supabase';
import { tanstackQueryClient } from '@/utils/provider/queries';

const StudentSelect = ({
  value,
  onChange,
  defaultValue,
  disabled,
}: {
  value?: string;
  onChange: (value: string | null) => void;
  defaultValue?: string;
  disabled?: boolean;
}) => {
  const [searched, setSearched] = useState<string>('');
  const { school } = useSession();
  const { data, isLoading } = useQuery({
    queryKey: [school.id, searched, 'students'],
    queryFn: async () => {
      return await supabase
        .from('students')
        .select('*', { count: 'exact' })
        .eq('school_id', school.id)
        .ilike('first_name', `%${searched}%`)
        .order('created_at', { ascending: true })
        .limit(20);
    },
  });
  const supabase = useSupabase();

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const full_name = useMemo(() => {
    return `${data?.data?.find((s) => s.id === Number(value))?.first_name ?? ''} ${data?.data?.find((s) => s.id === Number(value))?.last_name ?? ''}`;
  }, [value, data]);

  return (
    <Input.Wrapper withAsterisk label="Student">
      <Combobox
        store={combobox}
        disabled={disabled}
        withinPortal={false}
        onOptionSubmit={(val) => {
          onChange(val);
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <InputBase
            disabled={disabled}
            component="button"
            type="button"
            pointer
            onClick={() => combobox.toggleDropdown()}
            rightSectionPointerEvents="none"
            rightSection={isLoading ? <Loader size={18} /> : <Combobox.Chevron />}
          >
            {full_name || <Input.Placeholder>Pick value</Input.Placeholder>}
          </InputBase>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Search
            value={searched}
            rightSection={<Combobox.ClearButton onClear={() => setSearched('')} />}
            onChange={(event) => setSearched(event.currentTarget.value)}
            placeholder="Search studentess"
          />

          <Combobox.Options>
            {isLoading ? (
              <Combobox.Empty>Loading....</Combobox.Empty>
            ) : (
              <ScrollArea.Autosize type="scroll" mah={200}>
                {data?.data?.map((item) => <SelectOption item={item} />)}
              </ScrollArea.Autosize>
            )}

            {data?.data?.length === 0 && !isLoading && (
              <Combobox.Empty>Nothing found here...</Combobox.Empty>
            )}
          </Combobox.Options>
          <Combobox.Footer>
            <Text fz="xs" c="dimmed">
              {data?.data?.length || 0} results of {data?.count || 0}
            </Text>
          </Combobox.Footer>
        </Combobox.Dropdown>
      </Combobox>
    </Input.Wrapper>
  );
};

const SelectOption = ({ item }: { item: Tables<'students'> }) => {
  return (
    <Combobox.Option value={`${item.id}`} key={item.id}>
      <Group>
        <Avatar size={'sm'} name={`${item.first_name} ${item.last_name}`} color="initials" />
        <div>
          <Text fz="sm" fw={500}>
            {item.first_name} {item.last_name}
          </Text>
          <Text fz="xs" opacity={0.6}>
            joined at {DateTime.fromISO(item.created_at).toFormat('dd LLLL yyyy')}
          </Text>
        </div>
      </Group>
    </Combobox.Option>
  );
};

export default StudentSelect;
