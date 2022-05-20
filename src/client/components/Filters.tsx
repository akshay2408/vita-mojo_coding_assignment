import React, { useRef } from 'react';
import { Button, Space, DatePicker, Row, Col, Select } from 'antd';
import styled from 'styled-components';
import { useState } from 'react'
import { CSVLink } from 'react-csv'
import { getCsv, getStores } from '../app/api';


const { RangePicker } = DatePicker;
const { Option } = Select;

const StyledSpace = styled(Space)`
  width: 100%;
  align-items: center;
`;

export default function (props) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('')
  const [weekDay, setWeekDay] = useState(0)
  const [transactionData, setTransactionData] = useState([])
  const csvLink = useRef<null | HTMLParagraphElement>(null) // setup the ref that we'll use for the hidden CsvLink click once we've updated the data

  const onWeekdayChange = (value: number) => {
    setWeekDay(value);
  }

  function findByLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const str = `lat=${position.coords.latitude}&long=${position.coords.longitude}`
        getStores(str);
      });
    }
  }

  function onTimeRangeSubmit([startDate, endDate]: [
    moment.Moment,
    moment.Moment,
  ]) {
    if (startDate && endDate) {

      setStart(startDate.format('HH:mm'));
      setEnd(endDate.format('HH:mm'));
    }
  }
  const getTransactionData = async () => {
    await getCsv({})
      .then((res) => {
        setTransactionData(res.data)
      })
      .catch((e) => console.log(e))
    // @ts-ignore
    csvLink.current.link.click()
  }

  const formData = (e) => {
    var data = new FormData(e.target)
    let formObject = Object.fromEntries(data.entries())
    if (start && end && weekDay) {
      // @ts-ignore
      formObject.startHour = start
      // @ts-ignore
      formObject.endHour = end
      // @ts-ignore
      formObject.weekday = weekDay
    }
    return formObject
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const getFormData = formData(e)
    var str = [];
    for (var p in getFormData)
      if (p !== "") {
        if (getFormData.hasOwnProperty(p)) {
          //@ts-ignore
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(getFormData[p]));
        }
      }
    const data = str.join("&");
    getStores(data)

  }

  return (
    <>
      <StyledSpace direction="vertical">
        <form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Space direction="horizontal">
                <Button type="primary" onClick={findByLocation}>
                  Filter by current user location
                </Button>
              </Space>
              <Space direction="horizontal">
                <Button onClick={getTransactionData}>Download transactions to csv</Button>
                <CSVLink
                  data={transactionData}
                  filename='transactions.csv'
                  className='hidden'
                  ref={csvLink}
                  target='_blank'
                />

              </Space>
            </Col>
          </Row>
          <Row>
            <Col>
              <Space direction="horizontal">
                TODO: add filter by name functionality
              </Space>
            </Col>
          </Row>
          <Row>
            <Col>
              Filter stores by working hours
              <Select onChange={onWeekdayChange} placeholder="Pick week day">
                <Option name="weekday" value={1}>Monday</Option>
                <Option name="weekday" value={2}>Tuesday</Option>
                <Option name="weekday" value={3}>Wednesday</Option>
                <Option name="weekday" value={4}>Thursday</Option>
                <Option name="weekday" value={5}>Friday</Option>
                <Option name="weekday" value={6}>Saturday</Option>
                <Option name="weekday" value={7}>Sunday</Option>
              </Select>
              <RangePicker
                format="HH:mm"
                onChange={onTimeRangeSubmit}
                onOk={onTimeRangeSubmit}
                picker="time"
              />
            </Col>
            <input name="name" placeholder="name" />
          </Row>
          <button type="submit">submit</button>
        </form>
      </StyledSpace>
    </>
  );
}
