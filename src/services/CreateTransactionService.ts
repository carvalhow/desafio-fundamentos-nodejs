import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (!title) {
      throw Error('A title must be provided.');
    }

    if (!value || value <= 0) {
      throw Error('Value must be provided and should be > 0 ');
    }

    if (!type || (type !== 'income' && type !== 'outcome')) {
      throw Error('Type should be either Income or Outcome');
    }

    if (type === 'outcome') {
      const balance = this.transactionsRepository.getBalance();
      const balanceAfterOutcome: number = balance.total - value;

      if (balanceAfterOutcome < 0) {
        throw Error('Invalid transaction: your balance would be negative.');
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
