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
    if (!value) {
      throw Error('The value is not valid.');
    }

    if (type !== 'income' && type !== 'outcome') {
      throw Error('The transaction type is not valid.');
    }

    if (type === 'income' && value <= 0) {
      throw Error(
        'Transaction type of INCOME, the value must be greater than zero.',
      );
    }

    const balance = this.transactionsRepository.getBalance();

    if (type === 'outcome' && value > Math.abs(balance.total)) {
      throw Error(
        'Transaction type of OUTCOME, the value must be greater than balance total.',
      );
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
