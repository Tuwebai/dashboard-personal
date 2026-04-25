import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { Input, Select } from '../../../shared/ui/Input';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { AccountType, FinancialAccount } from '../../../shared/types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account?: FinancialAccount | null;
}

interface AccountFormState {
  name: string;
  type: AccountType;
  currency: string;
  color: string;
  isDefault: boolean;
}

const DEFAULT_ACCOUNT_STATE: AccountFormState = {
  name: '',
  type: 'checking',
  currency: 'USD',
  color: '#8b5cf6',
  isDefault: true,
};

const getAccountIcon = (type: AccountType) => {
  switch (type) {
    case 'checking':
      return 'landmark';
    case 'savings':
      return 'piggy-bank';
    case 'credit':
      return 'credit-card';
    case 'cash':
      return 'coins';
    case 'investment':
      return 'chart';
    default:
      return 'landmark';
  }
};

const buildFormState = (
  account: FinancialAccount | null | undefined,
  hasAccounts: boolean,
): AccountFormState =>
  account
    ? {
        name: account.name,
        type: account.type,
        currency: account.currency,
        color: account.color,
        isDefault: account.isDefault,
      }
    : {
        ...DEFAULT_ACCOUNT_STATE,
        isDefault: !hasAccounts,
      };

export function AccountModal({ isOpen, onClose, account }: AccountModalProps) {
  const { t } = useI18n();
  const { accounts, addAccount, updateAccount } = useAppStore();
  const [form, setForm] = useState<AccountFormState>(() => buildFormState(account, accounts.length > 0));
  const [errors, setErrors] = useState<Partial<Record<keyof AccountFormState, string>>>({});

  const typeOptions = useMemo(
    () => [
      { value: 'checking', label: t('finances.accountTypeChecking') },
      { value: 'savings', label: t('finances.accountTypeSavings') },
      { value: 'credit', label: t('finances.accountTypeCredit') },
      { value: 'cash', label: t('finances.accountTypeCash') },
      { value: 'investment', label: t('finances.accountTypeInvestment') },
    ],
    [t],
  );

  const title = account ? t('finances.editAccount') : t('finances.newAccount');

  const resetState = () => {
    setForm(buildFormState(account, accounts.length > 0));
    setErrors({});
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSave = () => {
    const nextErrors: Partial<Record<keyof AccountFormState, string>> = {};

    if (!form.name.trim()) {
      nextErrors.name = t('finances.accountNameRequired');
    }

    if (!form.currency.trim()) {
      nextErrors.currency = t('finances.accountCurrencyRequired');
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload = {
      name: form.name.trim(),
      type: form.type,
      balance: 0,
      currency: form.currency.trim().toUpperCase(),
      color: form.color,
      icon: getAccountIcon(form.type),
      isDefault: form.isDefault,
    };

    if (account) {
      updateAccount(account.id, payload);
      toast.success(t('finances.accountUpdated'));
    } else {
      addAccount(payload);
      toast.success(t('finances.accountCreated'));
    }

    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="sm">
      <div className="space-y-4 pt-2">
        <Input
          label={t('finances.accountNameLabel')}
          value={form.name}
          error={errors.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          placeholder={t('finances.accountNamePlaceholder')}
        />

        <Select
          label={t('finances.accountTypeLabel')}
          value={form.type}
          error={errors.type}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              type: event.target.value as AccountType,
            }))
          }
          options={typeOptions}
        />

        <Input
          label={t('finances.accountCurrencyLabel')}
          value={form.currency}
          error={errors.currency}
          onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value }))}
          placeholder="USD"
          maxLength={3}
        />

        <div className="grid grid-cols-[1fr_auto] gap-4">
          <Input
            label={t('finances.accountColorLabel')}
            type="color"
            value={form.color}
            onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
            className="h-11 px-2"
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/70">
              {t('finances.defaultAccount')}
            </label>
            <Button
              variant={form.isDefault ? 'primary' : 'ghost'}
              className="h-11 min-w-32"
              onClick={() => setForm((current) => ({ ...current, isDefault: !current.isDefault }))}
            >
              {form.isDefault ? t('finances.defaultEnabled') : t('finances.defaultDisabled')}
            </Button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" className="flex-1" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleSave}>
            {account ? t('common.saveChanges') : t('common.create')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
