import React from 'react';
import { Table, Row } from 'react-native-table-component';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  Alert,
} from 'react-native';

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch('http://192.168.10.122:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code === 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        Alert.alert('Error', `${error.message}:\n ${details}`);
      } else {
        Alert.alert('Error', `${error.extensions.code}: ${error.message}`);
      }
      return null; // Return null on error
    }
    return result.data;
  } catch (e) {
    Alert.alert('Error', `Error in sending data to server: ${e.message}`);
    return null; // Return null on error
  }
}

class IssueFilter extends React.Component {
  render() {
    return (
      <>
        {/****** Q1: Start Coding here. ******/}
        <View>
          <Text>Filter Issues:</Text>
          <TextInput
            placeholder="Status (e.g., Open)"
            onChangeText={(text) => console.log(`Status Filter: ${text}`)}
          />
          <TextInput
            placeholder="Effort >= (e.g., 5)"
            keyboardType="numeric"
            onChangeText={(text) => console.log(`Effort Filter: ${text}`)}
          />
          <Button title="Apply Filter" onPress={() => console.log('Filter Applied')} />
        </View>
        {/****** Q1: Code ends here ******/}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center', color: '#fff' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 4,
  },
});

function IssueRow(props) {
  const issue = props.issue;
  {/****** Q2: Coding Starts here. Create a row of data in a variable ******/}
  const rowData = [
    issue.id,
    issue.title,
    issue.status,
    issue.owner,
    issue.created ? issue.created.toISOString().split('T')[0] : 'N/A',
    issue.effort,
    issue.due ? issue.due.toISOString().split('T')[0] : 'N/A',
  ];
  {/****** Q2: Coding Ends here. ******/}
  return (
    <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
      <Row data={rowData} style={styles.row} textStyle={{ textAlign: 'center' }} />
      {/****** Q2: Coding Ends here. ******/}
    </>
  );
}

function IssueTable(props) {
  const issueRows = props.issues.map((issue) => <IssueRow key={issue.id} issue={issue} />);

  {/****** Q2: Start Coding here. Add Logic to initialize table header  ******/}
  const tableHeader = ['ID', 'Title', 'Status', 'Owner', 'Created', 'Effort', 'Due'];
  {/****** Q2: Coding Ends here. ******/}

  return (
    <View style={styles.container}>
      {/****** Q2: Start Coding here to render the table header/rows. **********/}
      <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
        <Row data={tableHeader} style={styles.header} textStyle={styles.text} />
        <ScrollView style={styles.dataWrapper}>{issueRows}</ScrollView>
      </Table>
      {/****** Q2: Coding Ends here. ******/}
    </View>
  );
}

class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    /****** Q3: Start Coding here. Create State to hold inputs ******/
    this.state = {
      title: '',
      owner: '',
      effort: '',
      status: 'New',
      due: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    /****** Q3: Code Ends here. ******/
  }

  /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput ******/
  handleInputChange(field, value) {
    this.setState({ [field]: value });
  }
  /****** Q3: Code Ends here. ******/

  handleSubmit() {
    /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end ******/
    const { title, owner, effort, status, due } = this.state;

    if (!title || !owner || !effort) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const issue = {
      title,
      owner,
      effort: parseInt(effort, 10),
      status,
      due: due ? new Date(due) : null,
      // 'created' will be set by the server
    };

    this.props.createIssue(issue);
    this.setState({ title: '', owner: '', effort: '', status: 'New', due: '' });
    /****** Q3: Code Ends here. ******/
  }

  render() {
    return (
      <View>
        {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit. *******/}
        <TextInput
          placeholder="Title"
          value={this.state.title}
          onChangeText={(text) => this.handleInputChange('title', text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Owner"
          value={this.state.owner}
          onChangeText={(text) => this.handleInputChange('owner', text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Effort"
          value={this.state.effort}
          keyboardType="numeric"
          onChangeText={(text) => this.handleInputChange('effort', text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Status"
          value={this.state.status}
          onChangeText={(text) => this.handleInputChange('status', text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Due Date (YYYY-MM-DD)"
          value={this.state.due}
          onChangeText={(text) => this.handleInputChange('due', text)}
          style={styles.input}
        />
        <Button title="Add Issue" onPress={this.handleSubmit} />
        {/****** Q3: Code Ends here. ******/}
      </View>
    );
  }
}

class BlackList extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    /****** Q4: Start Coding here. Create State to hold inputs ******/
    this.state = {
      name: '',
      reason: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    /****** Q4: Code Ends here. ******/
  }
  /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput ******/
  handleInputChange(field, value) {
    this.setState({ [field]: value });
  }
  /****** Q4: Code Ends here. ******/

  async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end ******/
    const { name, reason } = this.state;

    if (!name || !reason) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const query = `mutation addToBlacklist($name: String!, $reason: String!) {
      addToBlacklist(name: $name, reason: $reason) {
        id
      }
    }`;

    const variables = { name, reason };
    const data = await graphQLFetch(query, variables);

    if (data) {
      Alert.alert('Success', 'Owner added to blacklist.');
      this.setState({ name: '', reason: '' });
    }
    /****** Q4: Code Ends here. ******/
  }

  render() {
    return (
      <View>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit. *******/}
        <TextInput
          placeholder="Owner Name"
          value={this.state.name}
          onChangeText={(text) => this.handleInputChange('name', text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Reason"
          value={this.state.reason}
          onChangeText={(text) => this.handleInputChange('reason', text)}
          style={styles.input}
        />
        <Button title="Add to Blacklist" onPress={this.handleSubmit} />
        {/****** Q4: Code Ends here. ******/}
      </View>
    );
  }
}

export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
      issueList {
        id title status owner
        created effort due
      }
    }`;

    const data = await graphQLFetch(query);
    if (data && data.issueList) {
      this.setState({ issues: data.issueList });
    } else {
      Alert.alert('Error', 'Failed to load issues from server.');
    }
  }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
      issueAdd(issue: $issue) {
        id
      }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
      this.loadData();
    }
  }

  render() {
    return (
      <>
        {/****** Q1: Start Coding here. ******/}
        <IssueFilter />
        {/****** Q1: Code ends here ******/}

        {/****** Q2: Start Coding here. ******/}
        <IssueTable issues={this.state.issues} />
        {/****** Q2: Code ends here ******/}

        {/****** Q3: Start Coding here. ******/}
        <IssueAdd createIssue={this.createIssue} />
        {/****** Q3: Code Ends here. ******/}

        {/****** Q4: Start Coding here. ******/}
        <BlackList />
        {/****** Q4: Code Ends here. ******/}
      </>
    );
  }
}
